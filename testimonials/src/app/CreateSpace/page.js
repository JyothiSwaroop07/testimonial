import React from 'react'
import Image from 'next/image'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Navbar from '../components/Navbar/Navbar'
import LikeIcon from './LikeIcon.png'
import { CiVideoOn } from "react-icons/ci";
import { FaPen } from "react-icons/fa";

const questionList = [
    {
        id : 1,
        question : 'Who are you / what are you working on?'
    },
    {
        id : 2,
        question : 'How has [our product / service] helped you?'
    },
    {
        id : 3,
        question : 'What is the best thing about [our product / service]'
    },
]

const page = () => {
  return (
    <div className='w-[100vw]' >
        <Navbar/>
        <div className='flex w-[80vw] h-[100vh] m-auto rounded-[5px] p-[40px] '>
            <div className='flex flex-col justify-start border text-center p-5 border-dotted w-[35vw] m-2'>   
                <div className='bg-[aquamarine] rounded-[15px] border-solid border-[1px] w-[20vw] h-[30px] ml-auto mr-auto'>
                    <h2 className='text-center'>Live Preview - Testimonial Page</h2>
                </div>
                <div className='flex justify-center mt-10'>
                    <Image src={LikeIcon} alt="likeIcon" width={100} height={100} className='w-[145px]'/>
                </div>
                <h1 className='text-3xl mt-3' >Header goes here</h1>
                <p className='text-2xl mt-3'>Your custom message goes here</p>
                <div className='mt-5 p-[20px] flex flex-col justify-start text-left' >
                    <h1>Questions</h1>
                    <hr className='w-[120px] border-[blue] border-solid'/>
                    <ul>
                        {
                            questionList.map((eachQuestion)=>{
                                return <li key={eachQuestion.id} className='m-3 list-[dot]'>{eachQuestion.question}</li>
                            })
                        }
                    </ul>
                </div>
                <button type="button" className='flex flex-row justify-center w-[30vw] h-[40px] bg-[blue] text-[white] m-2 ' >
                    <h1 className='text-center m-auto flex flex-row '><CiVideoOn size={20} style={{margin: '2px' }} />  Record a Video</h1>
                </button>
                <button type="button" className='flex flex-row justify-center w-[30vw] h-[40px] bg-[grey] text-[white] m-2 ' >
                    <h1 className='text-center m-auto flex flex-row '><FaPen size={20} style={{margin: '2px' }} />  Record a Video</h1>
                </button>
            </div>
            <div className='flex flex-col justify-start border text-center p-[25px] border-solid w-[35vw] m-2 '>
                <h1 className='text-center text-3xl font-[bold] mt-3'>Create a new space</h1>
                <p className='mt-5'>After the Space is created, it will generate a dedicated page for collecting testimonials.</p>
                <form className='mt-3 p-[15px] flex flex-col justify-start text-left '>
                    <label for='name' >Space Name <span className='text-[red]' >*</span></label>
                    <input className='border-solid border-[2px] h-[35px] w-[28vw] outline-none ' id= "name" type="text" />
                    <label for ='logo' className='mt-2'>Space Logo  <i className='text-[grey]'>Optional</i></label>
                    <input type="file"  accept="image/" />
                    <label for='title' className='mt-2' >Header Title <span className='text-[red] ' >*</span></label>
                    <input className='border-solid border-[2px] h-[35px] w-[28vw] outline-none' id= "title" type="text" placeholder='Woul you ' />
                    <label for='message' className='mt-2' >Your Custom Message <span className='text-[red] ' >*</span></label>
                    <textarea className='border-solid border-[2px] h-[105px] w-[28vw] outline-none' id= "message" type="text" placeholder='Write a warm messag to your customers...' />

                    <button type="button" className='text-center w-[30vw] h-[40px] bg-[blue] text-[white] m-2 '>Create new Space</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default page