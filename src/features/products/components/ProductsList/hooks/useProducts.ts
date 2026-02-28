"use client";

import { useState, useCallback, useRef } from "react";
import { Form } from "antd";
import type { Product } from "../../../types";
import {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductsQuery,
    useUpdateProductMutation,
} from "../../../api/productsApi";
import { useLazyGetRawMaterialsQuery } from "../../../../rawMaterials";

type RawMaterialOption = { value: number; label: string };

const ITEMS_PER_PAGE = 20;

export const useProducts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const {
        data: productsResponse,
        isLoading: isLoadingGetProducts,
        isError: isErrorGetProducts,
    } = useGetProductsQuery({ page: currentPage, itemsPerPage });

    const [triggerGetRawMaterials, { isFetching: isLoadingRawMaterials }] =
        useLazyGetRawMaterialsQuery();

    const [rawMaterialOptions, setRawMaterialOptions] = useState<RawMaterialOption[]>([]);
    const [hasMoreRawMaterials, setHasMoreRawMaterials] = useState(false);
    const rawMaterialsPageRef = useRef(1);
    const rawMaterialsSearchRef = useRef("");
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadRawMaterials = useCallback(
        async (
            search: string,
            page: number,
            opts: { append: boolean; seed?: RawMaterialOption[] },
        ) => {
            const result = await triggerGetRawMaterials({
                name: search,
                page,
                itemsPerPage: ITEMS_PER_PAGE,
            });
            if ("data" in result && result.data) {
                const newOptions = result.data.data.map((rm) => ({
                    value: rm.id,
                    label: rm.name,
                }));
                setRawMaterialOptions((prev) => {
                    const base = opts.append ? prev : (opts.seed ?? []);
                    const merged = [...base, ...newOptions];
                    return merged.filter(
                        (opt, idx, arr) =>
                            arr.findIndex((o) => o.value === opt.value) === idx,
                    );
                });
                setHasMoreRawMaterials(
                    result.data.currentPage < result.data.totalPages,
                );
            }
        },
        [triggerGetRawMaterials],
    );

    const onSearchRawMaterials = useCallback(
        (search: string) => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
            searchDebounceRef.current = setTimeout(() => {
                rawMaterialsSearchRef.current = search;
                rawMaterialsPageRef.current = 1;
                loadRawMaterials(search, 1, { append: false });
            }, 300);
        },
        [loadRawMaterials],
    );

    const onLoadMoreRawMaterials = useCallback(() => {
        if (!hasMoreRawMaterials || isLoadingRawMaterials) return;
        const nextPage = rawMaterialsPageRef.current + 1;
        rawMaterialsPageRef.current = nextPage;
        loadRawMaterials(rawMaterialsSearchRef.current, nextPage, {
            append: true,
        });
    }, [hasMoreRawMaterials, isLoadingRawMaterials, loadRawMaterials]);

    const [
        updateProduct,
        { isLoading: isLoadingUpdateProduct, isError: isErrorUpdateProduct },
    ] = useUpdateProductMutation();

    const [
        createProduct,
        { isLoading: isLoadingCreateProduct, isError: isErrorCreateProduct },
    ] = useCreateProductMutation();

    const [deleteProduct, { isLoading: isLoadingDeleteProduct }] =
        useDeleteProductMutation();

    const onAdd = useCallback(
        async (product: Product) => {
            await createProduct({
                name: product.name,
                value: product.value,
                materials: product.materials.map((m) => ({
                    rawMaterialId: m.rawMaterialId,
                    quantity: m.quantity,
                })),
            });
        },
        [createProduct],
    );

    const onEdit = useCallback(
        async (product: Product) => {
            await updateProduct({
                id: product.id,
                name: product.name,
                value: product.value,
                materials: product.materials.map((m) => ({
                    rawMaterialId: m.rawMaterialId,
                    quantity: m.quantity,
                })),
            });
        },
        [updateProduct],
    );

    const onDelete = useCallback(
        async (id: number) => {
            await deleteProduct(id);
        },
        [deleteProduct],
    );

    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const openCreateModal = useCallback(() => {
        setEditingProduct(null);
        form.resetFields();
        setModalOpen(true);
        rawMaterialsSearchRef.current = "";
        rawMaterialsPageRef.current = 1;
        loadRawMaterials("", 1, { append: false });
    }, [form, loadRawMaterials]);

    const openEditModal = useCallback(
        (record: Product) => {
            setEditingProduct(record);
            form.setFieldsValue({
                id: record.id,
                name: record.name,
                value: record.value,
                materials: record.materials.map((m) => ({
                    rawMaterialId: m.rawMaterialId,
                    quantity: m.quantity,
                })),
            });
            setModalOpen(true);
            rawMaterialsSearchRef.current = "";
            rawMaterialsPageRef.current = 1;
            const seed = record.materials.map((m) => ({
                value: m.rawMaterialId,
                label: m.name,
            }));
            loadRawMaterials("", 1, { append: false, seed });
        },
        [form, loadRawMaterials],
    );

    const closeModal = useCallback(() => {
        setModalOpen(false);
        form.resetFields();
    }, [form]);

    const handleSubmit = useCallback(async () => {
        form.validateFields().then(
            async (values: { name: string; value: number; materials?: { rawMaterialId: number; quantity: number }[] }) => {
                const product: Product = {
                    id: editingProduct ? editingProduct.id : (null as unknown as number),
                    name: values.name,
                    value: values.value,
                    materials: (values.materials ?? [])
                        .filter((m) => m.rawMaterialId && m.quantity > 0)
                        .map((m) => ({
                            rawMaterialId: m.rawMaterialId,
                            name: rawMaterialOptions.find((o) => o.value === m.rawMaterialId)?.label ?? "",
                            quantity: m.quantity,
                        })),
                };
                if (editingProduct) {
                    await onEdit(product);
                } else {
                    await onAdd(product);
                }
                closeModal();
            },
        );
    }, [form, editingProduct, rawMaterialOptions, onAdd, onEdit, closeModal]);

    const handleDelete = useCallback((id: number) => onDelete(id), [onDelete]);

    return {
        form,
        modalOpen,
        editingProduct,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
        products: productsResponse,
        isLoadingGetProducts,
        isErrorGetProducts,
        rawMaterialOptions,
        isLoadingRawMaterials,
        hasMoreRawMaterials,
        onSearchRawMaterials,
        onLoadMoreRawMaterials,
        isLoadingCreateProduct,
        isLoadingUpdateProduct,
        isLoadingDeleteProduct,
        isErrorCreateProduct,
        isErrorUpdateProduct,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
    };
};
