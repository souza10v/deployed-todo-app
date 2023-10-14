import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import Auth from './components/Auth'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

function App() {

  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [ tasks, setTasks ] = useState(null)

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URLSERVERR}/todos/${userEmail}`)
      const json = await response.json()
      setTasks(json)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    if(authToken) {
      getData()
    }
  }, [])

  //Sort by date
  const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date)) //organiza por valores

  return (
    <div className="app">
      {!authToken && //se token falso
      <Auth/>}

      {authToken && //se token verdadeiro
      <>
      <ListHeader listName={`🏖️ Holliday tick List`} getData={getData} />

      {sortedTasks?.map((task) => 
      
      <ListItem key={task.id} task={task} getData={getData}/>)}
      </>}

    <p className="copyright"> Creative coding</p>
    </div>
  );
}

export default App;
