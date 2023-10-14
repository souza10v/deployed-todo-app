import Modal from './Modal'
import { useState } from 'react';
import { useCookies } from 'react-cookie'

const ListHeader = ({ listName, getData}) => {

  const [showModal, setShowModal] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const userEmail = cookies.Email

  const signOut = () => {
    console.log("worknig")
    removeCookie('Email')
    removeCookie('AuthToken')
    window.location.reload()
  }

  return (
    <div className="list-header" >
      <h1>{listName}</h1>
      <div className="button-container">
        <p className="user-email" >{userEmail}</p>
        <button className="create" onClick={() => setShowModal(true)} >Add New</button>
        <button className="signout" onClick={signOut}>Sign Out</button>
      </div>
      {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData}/> } {/* se show modal true carrega modal */}
    </div>
  );
};

export default ListHeader;
