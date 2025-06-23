import Image from "next/image";
import Room from "./pages/room.jsx";
import AuthPage from "./pages/auth.jsx";
import YouTubeHome from "./pages/youtubehome.jsx";
import NavBar from "./components/navbar.jsx";
import VideoPlayer from "./pages/videoplayer.jsx";

export default function Home() {
  return (
    // <AuthPage/>
    // <UploadForm/>
    // <Room/> // can watch youtube videos  or stream your own video
    // <YouTubeHome/> // Home page with all the videos from db, also searched videos
    // <NavBar/> // Navbar with search bar and upload button sigin in and sign out
    <VideoPlayer/> //for adaptive streaming, chagnes resolution based on network speed
  );
}
