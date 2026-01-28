import * as yup from 'yup';
import type { SearchParams } from '@/domain/entities/SearchParams';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Helper para obtener fecha de hoy sin hora
const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Helper para obtener fecha de un año desde hoy
const getOneYearFromNow = (): Date => {
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  oneYearFromNow.setHours(23, 59, 59, 999);
  return oneYearFromNow;
};

// Schema base de Yup para SearchParams
const searchParamsSchema = yup.object().shape({
  location: yup
    .string()
    .required('La ubicación es requerida')
    .trim()
    .min(2, 'La ubicación debe tener al menos 2 caracteres'),
  pickupDate: yup
    .date()
    .required('La fecha de recogida es requerida')
    .typeError('La fecha de recogida debe ser una fecha válida')
    .min(getToday(), 'La fecha de recogida no puede ser en el pasado')
    .max(
      getOneYearFromNow(),
      'La fecha de recogida no puede ser más de 1 año en el futuro'
    ),
  returnDate: yup
    .date()
    .required('La fecha de devolución es requerida')
    .typeError('La fecha de devolución debe ser una fecha válida')
    .min(getToday(), 'La fecha de devolución no puede ser en el pasado')
    .when('pickupDate', {
      is: (pickupDate: Date) => pickupDate != null,
      then: (schema) =>
        schema
          .min(
            yup.ref('pickupDate'),
            'La fecha de devolución debe ser posterior a la de recogida'
          )
          .test(
            'max-days',
            'La reserva no puede exceder 90 días',
            function (returnDate) {
              const { pickupDate } = this.parent;
              if (!pickupDate || !returnDate) return true;

              const daysDiff = Math.ceil(
                (returnDate.getTime() - pickupDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return daysDiff <= 90;
            }
          ),
    }),
});

// Schema parcial para validación en tiempo real (sin requerir todos los campos)
const createPartialSchema = (validateAll: boolean) => {
  const baseLocation = yup
    .string()
    .trim()
    .min(2, 'La ubicación debe tener al menos 2 caracteres');

  const basePickupDate = yup
    .date()
    .nullable()
    .typeError('La fecha de recogida debe ser una fecha válida')
    .when('pickupDate', {
      is: (pickupDate: Date | null | undefined) => pickupDate != null,
      then: (schema) =>
        schema
          .min(getToday(), 'La fecha de recogida no puede ser en el pasado')
          .max(
            getOneYearFromNow(),
            'La fecha de recogida no puede ser más de 1 año en el futuro'
          ),
    });

  const baseReturnDate = yup
    .date()
    .nullable()
    .typeError('La fecha de devolución debe ser una fecha válida')
    .when('returnDate', {
      is: (returnDate: Date | null | undefined) => returnDate != null,
      then: (schema) =>
        schema
          .min(getToday(), 'La fecha de devolución no puede ser en el pasado')
          .when('pickupDate', {
            is: (pickupDate: Date | null | undefined) => pickupDate != null,
            then: (schema) =>
              schema
                .min(
                  yup.ref('pickupDate'),
                  'La fecha de devolución debe ser posterior a la de recogida'
                )
                .test(
                  'max-days',
                  'La reserva no puede exceder 90 días',
                  function (returnDate) {
                    const { pickupDate } = this.parent;
                    if (!pickupDate || !returnDate) return true;

                    const daysDiff = Math.ceil(
                      (returnDate.getTime() - pickupDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return daysDiff <= 90;
                  }
                ),
          }),
    });

  return yup.object().shape({
    location: validateAll
      ? baseLocation.required('La ubicación es requerida')
      : baseLocation.nullable(),
    pickupDate: validateAll
      ? basePickupDate.required('La fecha de recogida es requerida')
      : basePickupDate.nullable(),
    returnDate: validateAll
      ? baseReturnDate.required('La fecha de devolución es requerida')
      : baseReturnDate.nullable(),
  });
};

/**
 * Valida los parámetros de búsqueda usando Yup
 * @param params - Parámetros parciales o completos a validar
 * @param validateAll - Si es true, valida todos los campos como requeridos
 * @returns Resultado de validación con errores por campo
 */
export function validateSearchForm(
  params: Partial<SearchParams>,
  validateAll: boolean = true
): ValidationResult {
  try {
    // Usar schema completo o parcial según validateAll
    const schema = validateAll
      ? searchParamsSchema
      : createPartialSchema(validateAll);

    // Validar
    schema.validateSync(params, {
      abortEarly: false,
      strict: false,
    });

    return {
      isValid: true,
      errors: {},
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      // Convertir errores de Yup al formato esperado
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });

      return {
        isValid: false,
        errors,
      };
    }

    // Error inesperado
    return {
      isValid: false,
      errors: {
        _general: 'Error de validación inesperado',
      },
    };
  }
}

/**
 * Valida un campo específico (útil para validación en tiempo real)
 * @param field - Nombre del campo a validar
 * @param value - Valor del campo
 * @param allValues - Todos los valores del formulario
 * @returns Mensaje de error o undefined si es válido
 */
export function validateField(
  field: keyof SearchParams,
  value: unknown,
  allValues: Partial<SearchParams>
): string | undefined {
  try {
    // Crear un schema temporal solo para este campo
    let fieldSchema: yup.AnySchema;

    switch (field) {
      case 'location':
        fieldSchema = yup
          .string()
          .trim()
          .min(2, 'La ubicación debe tener al menos 2 caracteres');
        break;
      case 'pickupDate':
        fieldSchema = yup
          .date()
          .nullable()
          .typeError('La fecha de recogida debe ser una fecha válida')
          .when([], {
            is: () => value != null,
            then: (schema) =>
              schema
                .min(getToday(), 'La fecha de recogida no puede ser en el pasado')
                .max(
                  getOneYearFromNow(),
                  'La fecha de recogida no puede ser más de 1 año en el futuro'
                ),
          });
        break;
      case 'returnDate':
        fieldSchema = yup
          .date()
          .nullable()
          .typeError('La fecha de devolución debe ser una fecha válida')
          .when([], {
            is: () => value != null,
            then: (schema) =>
              schema
                .min(getToday(), 'La fecha de devolución no puede ser en el pasado')
                .when([], {
                  is: () => allValues.pickupDate != null,
                  then: (schema) =>
                    schema
                      .min(
                        yup.ref('$pickupDate'),
                        'La fecha de devolución debe ser posterior a la de recogida'
                      )
                      .test(
                        'max-days',
                        'La reserva no puede exceder 90 días',
                        function (returnDate) {
                          const pickupDate = allValues.pickupDate;
                          if (!pickupDate || !returnDate) return true;

                          const daysDiff = Math.ceil(
                            (returnDate.getTime() - pickupDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          return daysDiff <= 90;
                        }
                      ),
                }),
          });
        break;
      default:
        return undefined;
    }

    // Validar el campo con contexto
    const context = { pickupDate: allValues.pickupDate };
    fieldSchema.validateSync(value, {
      abortEarly: true,
      strict: false,
      context,
    });

    return undefined;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return undefined;
  }
}
