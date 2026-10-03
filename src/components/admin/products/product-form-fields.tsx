"use client"

import {Control, Controller, FieldErrors, UseFormRegister} from "react-hook-form";
import {UpdateProductFormValues} from "@/common/schemas/product.schema";
import {FormGrid} from "@/components/ui/from-grid";
import {Field} from "@/components/ui/field";
import {FieldError} from "@/components/ui/field-error";
import {Input} from "@/components/ui/input";
import {CurrencyInput} from "@/components/ui/currency-input";
import {StatusSelect} from "@/components/admin/selecteables/status-select";

interface ProductFormFieldsProps {
    register: UseFormRegister<UpdateProductFormValues>;
    control: Control<UpdateProductFormValues>;
    errors: FieldErrors<UpdateProductFormValues>;
    categoryOptions: { value: string; label: string }[];
    isLoadingCategories: boolean;
}

export function ProductFormFields({register, control, errors, categoryOptions, isLoadingCategories}: ProductFormFieldsProps) {
    return (
        <FormGrid columns={2}>
            <Field label={"Nombre"}>
                <Input
                    type="text"
                    error={errors.name?.message}
                    registration={register("name")}
                />
            </Field>
            <Field label={"Descripción"}>
                <Input
                    type="text"
                    error={errors.description?.message}
                    registration={register("description")}
                />
            </Field>
            <Field label={"Precio"}>
                <Controller
                    name="price"
                    control={control}
                    render={({field}) => (
                        <CurrencyInput
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.price?.message}
                        />
                    )}
                />
            </Field>
            <Field label={"Stock"}>
                <Input
                    type="number"
                    error={errors.stock?.message}
                    registration={register("stock", {valueAsNumber: true})}
                />
            </Field>
            <Field label={"Marca"}>
                <Input
                    type="text"
                    error={errors.brand?.message}
                    registration={register("brand")}
                />
            </Field>
            <Field label={"Categoria"}>
                <Controller
                    name="categoryId"
                    control={control}
                    render={({field}) => (
                        <StatusSelect
                            value={field.value ? String(field.value) : ""}
                            options={categoryOptions}
                            placeholder={isLoadingCategories ? "Cargando..." : "Selecciona una categoría"}
                            disabled={isLoadingCategories}
                            onChange={(value) => field.onChange(Number(value))}
                            className={"sm:w-full truncate"}
                        />
                    )}
                />
                <FieldError message={errors.categoryId?.message}/>
            </Field>
        </FormGrid>
    )
}
