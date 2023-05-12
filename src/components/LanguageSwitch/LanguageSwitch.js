import "../../App.css";

export const LanguageSwitch = (props) => {
  return (
    <select
      value={props.language}
      onChange={props.handleLanguageChange}
      className="block appearance-none w-80 text-black bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
    >
      <option className="text-black" value="en">
        English
      </option>
      <option className="text-black" value="es">
        Español
      </option>
    </select>
  );
};

export default LanguageSwitch;
