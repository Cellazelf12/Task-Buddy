const Button = (props) => {
  return (
    <button
      className={props.className}
      onClick={props.callback}
      type={props.buttonType || "button"}
      id={props.id || ""}
    >
      {props.label}
    </button>
  );
};

export default Button;
