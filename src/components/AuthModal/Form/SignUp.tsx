import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z.object({
  socialName: z.string(),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-wrapper">
        <section>
          <label htmlFor="social-name">Nome Social</label>
          <input
            type="text"
            id="social-name"
            {...register("email")}
            placeholder="Digite seu nome"
          />
          {errors.socialName && (
            <p className="error-message">{errors.socialName?.message}</p>
          )}
        </section>
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
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            placeholder="***********"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </section>
      </div>
      <button type="submit" className="btn-submit">
        Cadastrar
      </button>
    </form>
  );
};
