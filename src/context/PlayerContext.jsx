import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

/*Create the context */
export const PlayerContext = createContext();

/*Create the provider */
const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    /*Initialize time to 0:00 */
    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    })
    /*Play the song */
    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    }
    /*Pause the song */
    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    /*Play the song with the id */
    const playWithId = async (id) => {
        await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayStatus(true);
    }

    /*Play the previous song */
    const previous = async () => {
        if (track.id > 0){
            await setTrack(songsData[track.id - 1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }
    
    /*Play the next song */
    const next = async () => {
        if (track.id < songsData.length - 1){
            await setTrack(songsData[track.id + 1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const seekSong = async (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration);
        
    }

    /*Initialize current for it to start when the play button is click*/ 
    useEffect(() =>{
        setTimeout(()=>{

            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }

        },1000);

    },[audioRef] )

    /*Create the context value */
    const contextValue ={
        audioRef,
        seekBg,
        seekBar,
        track,setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previous,next,
        seekSong
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;