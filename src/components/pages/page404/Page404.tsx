import { Link } from 'react-router-dom'
import './page404.scss'

const Page404 = () => {
  return (
    <div className="page404">
      <div className="container">
        <h3>What is</h3>
        <h3>ERC-404?</h3>
        <Link to={'/'}><button className='goback-btn'>Go to homepage</button></Link>
      </div>
    </div>
  )
}
export default Page404