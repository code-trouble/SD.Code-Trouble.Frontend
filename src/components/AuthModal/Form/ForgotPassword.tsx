import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const ForgotPassword: React.FC = () => {

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
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
        <p className="info-text">Enviaremos um e-mail para a recuperação de sua senha. </p>
      </div>
      <button type="submit" className="btn-submit">
        Enviar
      </button>
    </form>
  );
}