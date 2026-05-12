import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useRef } from 'react';
import { CreateAlunoDto, UpdateAlunoDto, Aluno } from '../../domain/Aluno';

declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

const cpfValidator = z.string().refine((val) => {
  const digits = val.replace(/\D/g, '');
  return digits.length === 11;
}, { message: 'CPF deve ter 11 dígitos' });

const alunoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: cpfValidator,
  dataNascimento: z.string().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
});

const updateSchema = alunoSchema.extend({
  ativo: z.boolean(),
});

type AlunoFormData = z.infer<typeof alunoSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

interface AlunoFormProps {
  initialData?: Aluno;
  onSubmit: (data: CreateAlunoDto | UpdateAlunoDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2');
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function AlunoForm({ initialData, onSubmit, onCancel, isLoading }: AlunoFormProps) {
  const isEdit = !!initialData;

  const form = useForm<AlunoFormData | UpdateFormData>({
    resolver: zodResolver(isEdit ? updateSchema : alunoSchema),
    defaultValues: initialData ? {
      ...initialData,
      cpf: initialData.cpf || '',
      telefone: initialData.telefone || '',
      dataNascimento: initialData.dataNascimento?.split('T')[0] || '',
    } : {
      nome: '',
      email: '',
      cpf: '',
      dataNascimento: '',
      telefone: '',
      endereco: '',
      ativo: true,
    },
    mode: 'onBlur'
  });

  useEffect(() => {
    const $ = window.$ || window.jQuery;
    if ($) {
      setTimeout(() => {
        $('[data-mask="cpf"]').mask('000.000.000-00');
        $('[data-mask="phone"]').mask('(00) 00000-0000');
      }, 500);
    }
  }, []);

  const handleSubmit = async (data: AlunoFormData | UpdateFormData) => {
    const telefoneDigits = data.telefone?.replace(/\D/g, '') || '';
    const submitData = {
      ...data,
      cpf: data.cpf.replace(/\D/g, ''),
      telefone: telefoneDigits || null,
      dataNascimento: data.dataNascimento || null,
    };
    await onSubmit(submitData as CreateAlunoDto | UpdateAlunoDto);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">{isEdit ? 'Editar Aluno' : 'Novo Aluno'}</h2>
        </div>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input
              {...form.register('nome')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {form.formState.errors.nome && (
              <p className="text-red-500 text-sm mt-1">{String(form.formState.errors.nome.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                {...form.register('email')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{String(form.formState.errors.email.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CPF *</label>
              <Controller
                name="cpf"
                control={form.control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={formatCPF(field.value)}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      field.onChange(digits);
                    }}
                    onBlur={field.onBlur}
                    data-mask="cpf"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="000.000.000-00"
                  />
                )}
              />
              {form.formState.errors.cpf && (
                <p className="text-red-500 text-sm mt-1">{String(form.formState.errors.cpf.message)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
              <input
                type="date"
                {...form.register('dataNascimento')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Controller
                name="telefone"
                control={form.control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={formatPhone(field.value)}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      field.onChange(digits);
                    }}
                    onBlur={field.onBlur}
                    data-mask="phone"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="(00) 00000-0000"
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Endereço</label>
            <input
              {...form.register('endereco')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {isEdit && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register('ativo')}
                id="ativo"
                className="w-4 h-4 text-orange-500"
              />
              <label htmlFor="ativo" className="text-sm font-medium">Aluno ativo</label>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : (isEdit ? 'Salvar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}