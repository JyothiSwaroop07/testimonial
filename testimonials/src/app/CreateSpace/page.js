"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar/Navbar';
import LikeIcon from './LikeIcon.png';
import { CiVideoOn } from "react-icons/ci";
import { FaPen } from "react-icons/fa";
import { db } from '../../lib/firebase'; // Import Firestore
import { useAuth } from '../../lib/useAuth'; // Custom hook for authentication
import { doc, updateDoc, arrayUnion, collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { FaPlusCircle } from "react-icons/fa";

const questionList = [
    { id: 1, question: 'Who are you / what are you working on?' },
    { id: 2, question: 'How has [our product / service] helped you?' },
    { id: 3, question: 'What is the best thing about [our product / service]' },
];

const Page = () => {
    const [spaceName, setSpaceName] = useState("");
    const { user } = useAuth(); // Assuming you have a custom hook to get user info

    const [questions, setQuestions] = useState(questionList);
    const [header , setHeader] = useState('Header goes here');
    const [customMessage , setCustomMessage] = useState('Your custom message goes here');

    const [isNameEnabled, setIsNameEnabled] = useState(true);     
    const [isEmailEnabled, setIsEmailEnabled] = useState(false);   
    const [isAddressEnabled, setIsAddressEnabled] = useState(false); 

    const handleNameChange = (event) => setIsNameEnabled(event.target.checked);
    const handleEmailChange = (event) => setIsEmailEnabled(event.target.checked);
    const handleAddressChange = (event) => setIsAddressEnabled(event.target.checked);

    const addSpaceToUser = async (newSpace) => {
        try {
            const spacesRef = collection(db, 'spaces'); // Reference to the spaces collection
            await addDoc(spacesRef, newSpace); // Create a new document in the spaces collection
            console.log("Space added successfully!");
        } catch (error) {
            console.error("Error adding space: ", error);
        }
      };

    const handleCreateSpace = async () => {
        if (!spaceName || !header || !customMessage) {
          alert("Please fill in all required fields!");
          return;
        }
      
        const newSpace = {
          name: spaceName,
          header: header,
          message: customMessage,
          questions: questionList,
          nameReq: isNameEnabled,
          emailReq: isEmailEnabled,
          addressReq: isAddressEnabled,
          videosCount: 0,
          textsCount: 0,
          ownerId: user.uid,
          
        };
      
        
        const userId = user.uid; 
      
        await addSpaceToUser(newSpace); 
      };

      const addQuestion = () => {
        const newQuestion = { id: questions.length + 1, question: '' };
        setQuestions([...questions, newQuestion]);
    };

    // Function to handle input changes
    const handleInputChange = (id, value) => {
        const updatedQuestions = questions.map((question) =>
        question.id === id ? { ...question, question: value } : question
        );
        setQuestions(updatedQuestions);
        console.log(questions)
    };

    // Function to delete a question
    const deleteQuestion = (id) => {
        const updatedQuestions = questions.filter((question) => question.id !== id);
        setQuestions(updatedQuestions);
    };

    return (
        
        <div className='w-[98vw] overflow-x-hidden' >
        <Navbar/>
        <div className=' flex flex-col w-[90vw] p-[10px] m-auto rounded-[5px] p-2 mb-2 lg:flex-row justify-center '>
            <div className='flex flex-col top-0 justify-start border p-[20px] border-dotted w-[85vw] lg:w-[35vw] mb-2 mt-3 text-center'>   
                <div className='bg-[aquamarine] rounded-[15px] border-solid border-[1px] w-[70vw] py-2  lg:w-[30vw] ml-auto mr-auto'>
                    <h2 className='text-center'>Live Preview - Testimonial Page</h2>
                </div>
                <div className='flex justify-center mt-10'>
                    <Image src={LikeIcon} alt="likeIcon" width={100} height={100} className='w-[145px]'/>
                </div>
                <h1 className='text-3xl mt-3' >{header}</h1>
                <p className='text-2xl mt-3 '>{customMessage}</p>
                <div className='mt-5 p-[20px] flex flex-col justify-start text-left' >
                    <h1>Questions</h1>
                    <hr className='w-[120px] border-[blue] border-solid'/>
                    <ul>
                        {
                            questions.map((eachQuestion)=>{
                                return <li key={eachQuestion.id} className='m-3 list-[dot]'>{eachQuestion.question}</li>
                            })
                        }
                    </ul>
                </div>
                <button type="button" className='flex flex-row justify-center w-[70vw] h-[40px] bg-[blue] text-[white] m-2 lg:w-[30vw] ' >
                    <h1 className='text-center m-auto flex flex-row '><CiVideoOn size={20} style={{margin: '2px' }} />  Record a Video</h1>
                </button>
                <button type="button" className='flex flex-row justify-center w-[70vw] h-[40px] bg-[grey] text-[white] m-2 lg:w-[30vw]' >
                    <h1 className='text-center m-auto flex flex-row '><FaPen size={20} style={{margin: '2px' }} />  Record a Video</h1>
                </button>
            </div>
            <div className='flex flex-col justify-center border p-[20px] border-dotted w-[85vw] lg:w-[35vw] m-3 h-[120vh] text-center'>
                <h1 className='text-center text-3xl font-normal mt-1'>Create a new space</h1>
                <p className='mt-1'>After the Space is created, it will generate a dedicated page for collecting testimonials.</p>
                <form className='mt-3 p-[15px] flex flex-col justify-start text-left'>
                    <label htmlFor='name' >Space Name <span className='text-[red]' >*</span></label>
                    <input className='border-solid border-[2px] h-[35px] w-[70vw] lg:w-[28vw] outline-none ' id= "name" type="text" onChange={(e)=>setSpaceName(e.target.value)} />
                    <label for ='logo' className='mt-4'>Space Logo  <i className='text-[grey]'>Optional</i></label>
                    <input type="file"  accept="image/" />
                    <label htmlFor='title' className='mt-4' >Header Title <span className='text-[red] ' >*</span></label>
                    <input className='border-solid border-[2px] h-[35px] w-[70vw] p-2 outline-none lg:w-[28vw]' id= "title" type="text" placeholder='Would you like to give a Shoutout... ' onChange={(e)=>setHeader(e.target.value)} />
                    <label htmlFor='message' className='mt-4' >Your Custom Message <span className='text-[red] ' >*</span></label>
                    <textarea className='border-solid border-[2px] h-[105px] w-[70vw] p-2 outline-none lg:w-[28vw]' id= "message" type="text" placeholder='Write a warm messag to your customers...' onChange={(e)=>setCustomMessage(e.target.value)}/>
                    <div className='mt-3 p-[10px] flex flex-col justify-start text-left lg:w-[28vw]'>
                        <h2>Questions</h2>
                        <div className='w-[70vw] border-[blue] border-solid lg:w-[28vw]'>
                            {questions.map((eachQuestion, index) => (
                                <div key={eachQuestion.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    {`${eachQuestion.id}.`} <input
                                        type="text"
                                        value={eachQuestion.question}
                                        onChange={(e) => handleInputChange(eachQuestion.id, e.target.value)}
                                        placeholder={`Question ${index + 1}`}
                                        style={{ flexGrow: 1, marginRight: '10px'}}
                                    />
                                    <span>{`${eachQuestion.question.length}/100`}</span>
                                    <button onClick={() => deleteQuestion(eachQuestion.id)} style={{ marginLeft: '10px' }}>
                                        🗑️
                                    </button>
                                </div>
                            ))}
                            {questions.length<5 && (<button type="button" className='flex flex-row justify-center w-[150px] h-[40px] border-dotted border-1px  m-2 ' onClick={addQuestion}>
                                <h1 className='text-center m-auto flex flex-row '><FaPlusCircle size={20} style={{margin: '2px' }} />  Add one (up to 5)</h1>
                            </button>)}
                        </div>
                    </div>
                    <h1>Collect extra information <i> info</i></h1>
                    <FormGroup>
                        <FormControlLabel
                        control={
                            <Switch
                            checked={isNameEnabled}
                            onChange={handleNameChange}
                            />
                        }
                        label="Name"
                        />
                        <FormControlLabel
                        control={
                            <Switch
                            checked={isEmailEnabled}
                            onChange={handleEmailChange}
                            />
                        }
                        label="Email"
                        />
                        <FormControlLabel
                        control={
                            <Switch
                            checked={isAddressEnabled}
                            onChange={handleAddressChange}
                            />
                        }
                        label="Address"
                        />
                    </FormGroup>
                    <button type="button" className='text-center w-[70vw] h-[40px] bg-[blue] text-[white] m-2 lg:w-[30vw] ' onClick={handleCreateSpace}>Create new Space</button>
                </form>
            </div>
        </div>

        </div>
    
)}

export default Page;
