import { VideoIcon } from 'lucide-react'

const CallButton = ({ handleVideoCall }) => {
  return (
    <div className='p-3 border-b items-center justify-end max-w-7xl ml-auto w-full absolute top-0 left-[90%]'>
        <button onClick={handleVideoCall} className='btn btn-success btn-sm text-white'>
            <VideoIcon className='size-6' />
        </button>
    </div>
  )
}

export default CallButton