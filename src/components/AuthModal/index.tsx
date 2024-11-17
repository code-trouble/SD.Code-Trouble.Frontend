import React from "react"
import { ProfessorCorrea } from "../../assets/images/svg";

interface IAuthModal {
    type: 'signIn' | 'signUp' | 'recovery' | 'forgot'
}

function generateModalContent(type: string) {
    switch (type) {
      case 'signIn':
        return <p>SignIn</p>;
  
      case 'signUp':
        return <p>SignUp</p>;
  
      case 'recovery':
        return <p>Recovery</p>;
  
      case 'forgot':
        return <p>Forgot</p>;
  
      default:
        return <p>Não foi selecionado um type ao modal</p>;
    }
  }
  

export const AuthModal: React.FC<IAuthModal> = ({ type }) => {
    return (
        <dialog>
            <figure>
                <img src={ProfessorCorrea} alt="avatar do professor correa" />
            </figure>
            <aside>
                {
                    type && generateModalContent(type)
                }
            </aside>
        </dialog>
    )
}