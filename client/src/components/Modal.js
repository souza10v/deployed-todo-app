import { useState } from 'react'
import { useCookies } from 'react-cookie'

const Modal = ({mode, setShowModal, getData, task}) => {

  //const mode = 'create' 

  const editMode = mode === 'edit' ? true : false //if mode = edit true, if not false
  const [cookies, setCookie, removeCookie ]= useCookies(null)

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email, //if edit mode task = true, recebe dados
    title: editMode ? task.title : "" , 
    progress: editMode ? task.progress : 0,
    date: editMode ? task.date : new Date() //if true new date, para saber ultima hora edita
  })

  const postData = async (e) => { 
    e.preventDefault()
    try{
      const response = await fetch(`${process.env.REACT_APP_URLSERVERR}/todos`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (response.status === 200){
        console.log("Worked")
        setShowModal(false)
        getData()
      }
    } catch(err) {
      console.error(err)
    }
  }

  const editdata = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.REACT_APP_URLSERVERR}/todos/${task.id}`,{
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if(response.status === 200){
        setShowModal(false)
        getData()
      }
    } catch(err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target 

    setData(data => ({
      ...data, // colocando as informacoes separadas
      [name] : value //coloca o valor na variavel necessaria
    }))
  }

  return (
    <div className="overlay">
      <div className="modal">
      <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form>
          <input
            required
            maxLength={30}
            placeholder="Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <label>
            Drag to select current progress
          </label>
          <input
  required
  type="range"
  min="0"
  max="100"
  name="progress"
  value={data.progress}
  onChange={handleChange}
  style={{ background: 'linear-gradient(to right, rgb(141, 181, 145), rgb(141, 181, 145))' }}
/>
          <input className={mode} onClick={ editMode ? editdata : postData} type="submit"/> 
          {/* se edit mode */}
        </form>
      </div>
    </div>
  );
}

export default Modal;
