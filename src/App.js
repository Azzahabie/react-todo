import React, { useState, useEffect } from 'react'
import axios from "axios";
import Modal from 'react-modal';
import './App.css';
import trashIcon from './img/trash.png'
import editIcon from './img/edit.png'
import addIcon from './img/add.png'
import closeIcon from './img/close.png'

function App() {

  const [todoList, setTodoList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [currentView, setCurrentView] = useState()
  const [currentTitle, setCurrentTitle] = useState()
  const [currentDesc, setCurrentDesc] = useState()
  const [currentStatus, setCurrentStatus] = useState()
  const [currentID, setCurrentID] = useState()

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    if (currentView != null) {
      setCurrentTitle(currentView.title)
      setCurrentDesc(currentView.description)
      setCurrentStatus(currentView.status)
      setCurrentID(currentView.id)
    }
  }, [currentView])

  const getList = () => {
    axios
      .get("https://django-todo-azza.herokuapp.com/api/todos/")
      .then((res) => {
        res.data.push({ "blank": true })
        console.log(res.data);
        setTodoList(res.data)
      })
      .catch((err) => console.log(err))
  }

  const displayCompleted = (status) => {
    if (status) {
      return (
        <p>Complete</p>
      )
    } else {
      return (
        <p>Incomplete</p>
      )
    }

  }

  const editComplete = (item) => {
    let currentState = item.completed
    item.completed = !currentState
    axios
      .put(`https://django-todo-azza.herokuapp.com/api/todos/${item.id}/`, item)
      .then((res) => getList())
      .catch((err) => console.log(err))
  }
  function openModal(item) {
    setCurrentView(item)
    setShowModal(true)
  }

  const showNewModel = () => {
    setCurrentTitle(null)
    setCurrentStatus(null)
    setCurrentDesc(null)
    setShowNewModal(true)
  }



  function closeModal() {
    setShowModal(false);
    setShowNewModal(false)
  }

  const submitEdit = () => {
    let data = {
      "title": currentTitle,
      "description": currentDesc,
      "completed": currentStatus
    }
    axios
      .put(`https://django-todo-azza.herokuapp.com/api/todos/${currentID}/`, data)
      .then((res) => {
        getList()
        closeModal()
      })
      .catch((err) => console.log(err))
  }

  const deleteTask = (task) => {
    axios
      .delete(`/api/todos/${task.id}/`)
      .then((res) => getList())
      .catch((err) => console.log(err))
  }

  const addTask = () => {
    let data = {
      "title": currentTitle,
      "description": currentDesc,
      "completed": false
    }
    axios
      .post(`https://django-todo-azza.herokuapp.com/api/todos/`, data)
      .then((res) => {
        getList()
        closeModal()
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className={'vwvh100 bg-primary'}>
      <div className='topBar bg-secondary d-flex a-center j-center'>
        <h2 className='m-left-start white-font letter-spacing'>Azzahabie's TodoList</h2>
      </div>
      <div className='w-90  m-auto mt-30'>
        <section className='grid grid-3Col'>
          {todoList.map((item, index) => (
            !item.blank ? <div key={index} className='bg-white round-corners shadow'>
              <div className={`${item.completed ? 'complete' : 'incomplete'} title white-font round-corners`}>
                <div className='w-90 m-auto d-flex j-space '>
                  <div className=' mxw-80 overflow-h letter-spacing'><h3 className='inline  '>{item.title}</h3></div>
                  <input className='float-right' type="checkbox" defaultChecked={item.completed} onChange={() => editComplete(item)}></input>
                </div>
              </div>

              <div className='w-90 m-auto mt-10'><p>{item.description}</p></div>
              <div className='w-90 m-auto d-flex j-end mt-10 mb-10'>
                <img onClick={() => openModal(item)} src={editIcon} alt='logo' className='icon mr-15' />
                <img onClick={() => deleteTask(item)} src={trashIcon} alt='logo' className='icon ' />
              </div>
            </div>
              :
              <div className='bg-white d-flex j-center a-center round-corners'>
                <img onClick={() => showNewModel()} src={addIcon} alt='logo' className='big-icon ' />

              </div>

          ))}
        </section>
      </div>
      {currentView == null ? null :
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Edit Modal"
          ariaHideApp={false}
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className='h-100 grid grid-4row'>
            <div className='w-100'>
              <img onClick={closeModal} src={closeIcon} alt='logo' className=' float-right closeicon' />
            </div>
            <div className='w-100 d-flex j-center a-center f-col '>
              <label className='p-5'>Title</label>
              <textarea className='w-90 h-50 p-5 ' value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} />
            </div>

            <div className='w-100 d-flex j-center a-center f-col'>
              <label className='p-5'>Description</label>
              <textarea className='w-90 h-90 p-5' value={currentDesc} onChange={e => setCurrentDesc(e.target.value)} />
            </div>


            <div className='W-100 d-flex j-center a-center '>
              {/* <select name="status" defaultValue={currentStatus ? true : false} onChange={e => setCurrentStatus(e.target.value)}>
                <option value={true}>completed</option>
                <option value={false}>Incomplete</option>
              </select> */}
              <button className='update-btn bg-title letter-spacing ' onClick={() => submitEdit()}>Update</button>
            </div>
          </div>
        </Modal>}
      <Modal
        isOpen={showNewModal}
        onRequestClose={closeModal}
        contentLabel='New Modal'
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className='h-100 grid grid-4row'>
          <div className='w-100'>
            <img onClick={closeModal} src={closeIcon} alt='logo' className=' float-right closeicon' />
          </div>
          <div className='w-100 d-flex j-center a-center f-col '>
            <label className='p-5'>Title</label>
            <textarea className='w-90 h-50 p-5 ' value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} />
          </div>

          <div className='w-100 d-flex j-center a-center f-col'>
            <label className='p-5'>Description</label>
            <textarea className='w-90 h-90 p-5' value={currentDesc} onChange={e => setCurrentDesc(e.target.value)} />
          </div>


          <div className='W-100 d-flex j-center a-center '>
            {/* <select name="status" defaultValue={currentStatus ? true : false} onChange={e => setCurrentStatus(e.target.value)}>
                <option value={true}>completed</option>
                <option value={false}>Incomplete</option>
              </select> */}
            <button className='update-btn bg-title letter-spacing ' onClick={() => addTask()}>Submit</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default App
