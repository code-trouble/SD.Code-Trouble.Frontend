import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const recoveryPasswordSchema =   z
.object({
  email: z.string().email("Email inválido"),
  newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(8, "A confirmação da senha deve ter pelo menos 8 caracteres"),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"], // Aponta o erro para o campo `confirmPassword`
});

type RecoveryPasswordFormData = z.infer<typeof recoveryPasswordSchema>

export const RecoveryPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<RecoveryPasswordFormData>({
    resolver: zodResolver(recoveryPasswordSchema)
  })

  const onSubmit = (data: RecoveryPasswordFormData) => {
    console.log(data)
  }
  return (
    <form className="auth-form"  onSubmit={handleSubmit(onSubmit)}>
      <div className="input-wrapper">
        <section>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email")}
            placeholder="Digite seu email"
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </section>
        <section>
          <label htmlFor="new-password">Nova Senha</label>
          <input
            type="password"
            id="new-password"
            {...register("newPassword")}
            placeholder="***********"
          />
          {errors.newPassword && (
            <p className="error-message">{errors.newPassword.message}</p>
          )}
        </section>
        <section>
          <label htmlFor="confirm-password">Confirme a Senha</label>
          <input
            type="password"
            id="confirm-password"
            {...register("confirmPassword")}
            placeholder="***********"
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword.message}</p>
          )}
        </section>
      </div>
      <button type="submit" className="btn-submit">
        Cadastrar
      </button>
    </form>
  );
}