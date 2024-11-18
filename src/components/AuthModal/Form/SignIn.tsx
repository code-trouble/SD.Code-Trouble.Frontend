import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <button className="btn-link" type="button">
          Esqueceu a senha?
        </button>
      </div>
      <button type="submit" className="btn-submit">
        Entrar
      </button>
    </form>
  );
};
