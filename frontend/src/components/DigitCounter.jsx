import {ChevronDown, ChevronUp} from 'lucide-react'

export default function DigitCounter({ roomInt="0", handleRoomInt}){
    return (
        <div className='flex gap-2'>
            <button 
                onClick={() => handleRoomInt("st1", "digit", "room", -1)}
                className='border-2 border-gray-300 rounded-lg hover:border-rose-500 transition-colors duration-200'>
                    <ChevronDown />
            </button>
            <span>{roomInt}</span>
            <button 
                onClick={() => handleRoomInt("st1", "digit", "room", 1)}
                className="border-2 border-gray-300 rounded-lg hover:border-rose-500 transition-colors duration-200">
                    <ChevronUp />
            </button>
        </div>
    )
}

