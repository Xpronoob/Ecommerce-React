import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  FormValues,
  schema
} from '@/components/Admin/Users/CreateForm/createFormModel';
import { zodResolver } from '@hookform/resolvers/zod';
import InputForm from '@/components/ui/InputForm';
import { useMutation } from '@tanstack/react-query';
import { UserService } from '@/services/Admin/user.service';

const CreateForm = () => {
  const [customError, setCustomError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      active: false,
      confirmPassword: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      img: ''
    }
  });

  const mutation = useMutation({
    mutationFn: (newUser: FormValues) => UserService.create(newUser),
    onSuccess: (data) => {
      // setUser(data.data);
      // navigate('/admin/users/:data.user_id');
    },
    onError: (error: any) => {
      setCustomError(error.response?.data?.message || 'Ha ocurrido un error');
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputForm<FormValues>
        fieldKey='email'
        control={control}
        label='Email'
        type='email'
        error={errors.email}
      />
      <InputForm<FormValues>
        fieldKey='password'
        control={control}
        label='Password'
        type='password'
        error={errors.password}
      />
      <InputForm<FormValues>
        fieldKey='active'
        control={control}
        label='Status'
        type='checkbox'
        error={errors.active}
      />
      <InputForm<FormValues>
        fieldKey='confirmPassword'
        control={control}
        label='Confirm Password'
        type='password'
        error={errors.confirmPassword}
      />
      <InputForm<FormValues>
        fieldKey='first_name'
        control={control}
        label='First Name'
        type='text'
        error={errors.first_name}
      />
      <InputForm<FormValues>
        fieldKey='last_name'
        control={control}
        label='Last Name'
        type='text'
        error={errors.last_name}
      />
      <InputForm<FormValues>
        fieldKey='phone_number'
        control={control}
        label='Phone Number'
        type='text'
        error={errors.phone_number}
      />
      <InputForm<FormValues>
        fieldKey='img'
        control={control}
        label='User Image'
        type='text'
        error={errors.img}
      />
      <button type='submit' disabled={mutation.isPending}>
        Submit
      </button>

      {mutation.isPending && <p>Cargando...</p>}
      {customError && <p>{customError}</p>}
      {mutation.isSuccess && <p>Usuario creado con éxito!</p>}
    </form>
  );
};

export default CreateForm;
