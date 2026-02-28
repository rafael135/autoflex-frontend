import { useState, useCallback, useEffect } from "react";
import { Form, App } from "antd";
import type { RawMaterial } from "../../../types";
import {
    useGetRawMaterialsQuery,
    useCreateRawMaterialMutation,
    useUpdateRawMaterialMutation,
    useDeleteRawMaterialMutation,
} from "../../../api/rawMaterialsApi";

export const useRawMaterials = () => {
    const { message } = App.useApp();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const {
        data: rawMaterialsResponse,
        isLoading: isLoadingGetRawMaterials,
        isError: isErrorGetRawMaterials,
        refetch: refetchRawMaterials,
    } = useGetRawMaterialsQuery({ page: currentPage, itemsPerPage });

    const [createRawMaterial, { isLoading: isLoadingCreate, isError: isErrorCreate }] =
        useCreateRawMaterialMutation();

    const [updateRawMaterial, { isLoading: isLoadingUpdate, isError: isErrorUpdate }] =
        useUpdateRawMaterialMutation();

    const [deleteRawMaterial, { isLoading: isLoadingDelete }] =
        useDeleteRawMaterialMutation();

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
                    try {
                        if (editingRawMaterial) {
                            await updateRawMaterial({
                                id: rawMaterial.id,
                                name: rawMaterial.name,
                                stockQuantity: rawMaterial.stockQuantity,
                            }).unwrap();
                            message.success("Insumo atualizado com sucesso!");
                        } else {
                            await createRawMaterial({
                                name: rawMaterial.name,
                                stockQuantity: rawMaterial.stockQuantity,
                            }).unwrap();
                            message.success("Insumo cadastrado com sucesso!");
                        }
                        closeModal();
                    } catch {
                        // isErrorCreate / isErrorUpdate drive the ErrorAlert in the UI
                    }
                },
            )
            .catch(() => {
                // validateFields() rejects when form is invalid — handled by Ant Design inline messages
            });
    }, [form, editingRawMaterial, closeModal, updateRawMaterial, message, createRawMaterial]);

    const handleDelete = useCallback(async (id: number) => {
        try {
            await deleteRawMaterial(id).unwrap();
            message.success("Insumo excluído com sucesso!");
        } catch {
            message.error("Erro ao excluir insumo. Tente novamente.");
        }
    }, [deleteRawMaterial, message]);

    useEffect(() => {
        refetchRawMaterials();
    }, [refetchRawMaterials]);

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
        isErrorCreate,
        isErrorUpdate,
        isLoadingCreate,
        isLoadingUpdate,
        isLoadingDelete,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
    };
};
