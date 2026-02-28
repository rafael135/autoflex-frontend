import { useState, useCallback } from "react";
import { Form } from "antd";
import type { RawMaterial } from "../../../types";
import {
    useGetRawMaterialsQuery,
    useCreateRawMaterialMutation,
    useUpdateRawMaterialMutation,
    useDeleteRawMaterialMutation,
} from "../../../api/rawMaterialsApi";

export const useRawMaterials = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const {
        data: rawMaterialsResponse,
        isLoading: isLoadingGetRawMaterials,
        isError: isErrorGetRawMaterials,
    } = useGetRawMaterialsQuery({ page: currentPage, itemsPerPage });

    const [createRawMaterial, { isLoading: isLoadingCreate }] =
        useCreateRawMaterialMutation();

    const [updateRawMaterial, { isLoading: isLoadingUpdate }] =
        useUpdateRawMaterialMutation();

    const [deleteRawMaterial, { isLoading: isLoadingDelete }] =
        useDeleteRawMaterialMutation();

    const onAdd = useCallback(
        async (rawMaterial: RawMaterial) => {
            await createRawMaterial({
                name: rawMaterial.name,
                stockQuantity: rawMaterial.stockQuantity,
            });
        },
        [createRawMaterial],
    );

    const onEdit = useCallback(
        async (rawMaterial: RawMaterial) => {
            await updateRawMaterial({
                id: rawMaterial.id,
                name: rawMaterial.name,
                stockQuantity: rawMaterial.stockQuantity,
            });
        },
        [updateRawMaterial],
    );

    const onDelete = useCallback(
        async (id: number) => {
            await deleteRawMaterial(id);
        },
        [deleteRawMaterial],
    );

    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRawMaterial, setEditingRawMaterial] =
        useState<RawMaterial | null>(null);

    const openCreateModal = useCallback(() => {
        setEditingRawMaterial(null);
        form.resetFields();
        setModalOpen(true);
    }, [form]);

    const openEditModal = useCallback(
        (record: RawMaterial) => {
            setEditingRawMaterial(record);
            form.setFieldsValue({
                name: record.name,
                stockQuantity: record.stockQuantity,
            });
            setModalOpen(true);
        },
        [form],
    );

    const closeModal = useCallback(() => {
        setModalOpen(false);
        form.resetFields();
    }, [form]);

    const handleSubmit = useCallback(async () => {
        form
            .validateFields()
            .then(
                async (values: { name: string; stockQuantity: number }) => {
                    const rawMaterial: RawMaterial = {
                        id: editingRawMaterial
                            ? editingRawMaterial.id
                            : (null as unknown as number),
                        name: values.name,
                        stockQuantity: values.stockQuantity,
                    };
                    if (editingRawMaterial) {
                        await onEdit(rawMaterial);
                    } else {
                        await onAdd(rawMaterial);
                    }
                    closeModal();
                },
            );
    }, [form, editingRawMaterial, onAdd, onEdit, closeModal]);

    const handleDelete = useCallback(
        (id: number) => onDelete(id),
        [onDelete],
    );

    return {
        form,
        modalOpen,
        editingRawMaterial,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
        handleDelete,
        rawMaterials: rawMaterialsResponse,
        isLoadingGetRawMaterials,
        isErrorGetRawMaterials,
        isLoadingCreate,
        isLoadingUpdate,
        isLoadingDelete,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
    };
};
