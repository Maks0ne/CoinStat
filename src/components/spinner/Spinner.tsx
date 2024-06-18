import spinnerIcon from '../../assets/images/spinnerIcon.gif'
import './spinner.scss'

const Spinner = () => {
  return (
    <div className="spinner">
      <p>Loading...</p>
      <img src={spinnerIcon} alt="Spinner" />
    </div>
  )
};

export default Spinner