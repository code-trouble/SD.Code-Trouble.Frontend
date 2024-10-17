import { NavBarComponent } from "../../components/navbar"

export const ComingSoonPage = () => {
  return (
    <div className="main-wrapper">
      <NavBarComponent/>
      <div className="hero">
        <h1> Coming soon! </h1>
        <p>Estamos cozinhando algo. de devs para devs</p>
        <button>Voltar para a Suporte</button>
      </div>
    </div>
  );
}