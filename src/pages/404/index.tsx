import { NavBarComponent } from "../../components/navbar";

export const ErrorPage = () => {

  return (
    <div className="main-wrapper">
      <NavBarComponent />
      <div className="hero">
        <h1> 404 <span className="hide-on-mobile">-</span> <span className="enable-on-mobile"><br /></span> Page not Found </h1>
        <p>A página que está procurando não existe ou está temporariamente indisponível.</p>
        <button>Voltar para a Home</button>
      </div>
    </div>
  );
}
