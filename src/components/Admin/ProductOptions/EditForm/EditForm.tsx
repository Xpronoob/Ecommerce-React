import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputForm from '@/components/ui/InputForm';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { FormValues, schema } from './editFormModel';
import { ProductOptionService } from '@/services/Admin/productOptions.service';

const EditForm = () => {
  const { id } = useParams<{ id: string }>();
  const [customError, setCustomError] = useState('');

  const {
    data: productOptions,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['/admin/productOptions', id],
    queryFn: () => ProductOptionService.getById(id!),
    enabled: !!id
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      product_options_name: '',
      active: false,
      color: false,
      size: false,
      storage: false,
      devices: false
    }
  });

  useEffect(() => {
    if (productOptions) {
      reset(productOptions);
    }
  }, [productOptions, reset]);

  const mutation = useMutation({
    mutationFn: (updatedProductOptions: FormValues) =>
      ProductOptionService.update(id!, updatedProductOptions),
    onSuccess: () => {
      // navigate(`/admin/productOptions/${id}`);
    },
    onError: (error: any) => {
      setCustomError(error.response?.data?.message || 'Ha ocurrido un error');
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    mutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error al cargar el tipo de producto.</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputForm<FormValues>
        fieldKey='product_options_name'
        control={control}
        label='Product Type'
        type='text'
        error={errors.product_options_name}
      />
      <InputForm<FormValues>
        fieldKey='active'
        control={control}
        label='Status'
        type='checkbox'
        error={errors.active}
      />

      <InputForm<FormValues>
        fieldKey='color'
        control={control}
        label='Color'
        type='checkbox'
        error={errors.color}
      />
      <InputForm<FormValues>
        fieldKey='size'
        control={control}
        label='Size'
        type='checkbox'
        error={errors.size}
      />
      <InputForm<FormValues>
        fieldKey='storage'
        control={control}
        label='Storage'
        type='checkbox'
        error={errors.storage}
      />
      <InputForm<FormValues>
        fieldKey='devices'
        control={control}
        label='Devices'
        type='checkbox'
        error={errors.devices}
      />
      <button type='submit' disabled={mutation.isPending}>
        {mutation.isPending ? 'Actualizando...' : 'Actualizar'}
      </button>
      {customError && <p>{customError}</p>}
      {mutation.isSuccess && <p>Tipo de producto actualizado con éxito!</p>}
    </form>
  );
};

export default EditForm;
