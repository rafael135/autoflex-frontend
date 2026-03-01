"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Form, App } from "antd";
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
    const { message } = App.useApp();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const {
        data: productsResponse,
        isLoading: isLoadingGetProducts,
        isFetching: isFetchingGetProducts,
        isError: isErrorGetProducts,
        refetch: refetchProducts,
    } = useGetProductsQuery({ page: currentPage, itemsPerPage });

    const [triggerGetRawMaterials, { isFetching: isLoadingRawMaterials }] =
        useLazyGetRawMaterialsQuery();

    const [rawMaterialOptions, setRawMaterialOptions] = useState<
        RawMaterialOption[]
    >([]);
    const [hasMoreRawMaterials, setHasMoreRawMaterials] = useState(false);
    const rawMaterialsPageRef = useRef(1);
    const rawMaterialsSearchRef = useRef("");
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

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
            if (searchDebounceRef.current)
                clearTimeout(searchDebounceRef.current);
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
        form.validateFields()
            .then(
                async (values: {
                    name: string;
                    value: number;
                    materials?: { rawMaterialId: number; quantity: number }[];
                }) => {
                    const product: Product = {
                        id: editingProduct
                            ? editingProduct.id
                            : (null as unknown as number),
                        name: values.name,
                        value: values.value,
                        materials: (values.materials ?? [])
                            .filter((m) => m.rawMaterialId && m.quantity > 0)
                            .map((m) => ({
                                rawMaterialId: m.rawMaterialId,
                                name:
                                    rawMaterialOptions.find(
                                        (o) => o.value === m.rawMaterialId,
                                    )?.label ?? "",
                                quantity: m.quantity,
                            })),
                    };
                    try {
                        if (editingProduct) {
                            await updateProduct({
                                id: product.id,
                                name: product.name,
                                value: product.value,
                                materials: product.materials.map((m) => ({
                                    rawMaterialId: m.rawMaterialId,
                                    quantity: m.quantity,
                                })),
                            }).unwrap();
                            message.success("Produto atualizado com sucesso!");
                        } else {
                            await createProduct({
                                name: product.name,
                                value: product.value,
                                materials: product.materials.map((m) => ({
                                    rawMaterialId: m.rawMaterialId,
                                    quantity: m.quantity,
                                })),
                            }).unwrap();
                            message.success("Produto cadastrado com sucesso!");
                        }
                        closeModal();
                    } catch {
                        // isErrorCreateProduct / isErrorUpdateProduct drive the ErrorAlert in the UI
                    }
                },
            )
            .catch(() => {
                // validateFields() rejects when form is invalid — handled by Ant Design inline messages
            });
    }, [
        form,
        editingProduct,
        rawMaterialOptions,
        closeModal,
        updateProduct,
        message,
        createProduct,
    ]);

    const handleDelete = useCallback(
        async (id: number) => {
            try {
                await deleteProduct(id).unwrap();
                message.success("Produto excluído com sucesso!");
            } catch {
                message.error("Erro ao excluir produto. Tente novamente.");
            }
        },
        [deleteProduct, message],
    );

    useEffect(() => {
        refetchProducts();
    }, [refetchProducts]);

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
        isLoadingGetProducts: isLoadingGetProducts || isFetchingGetProducts,
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
