import React from "react";
import { RiPlayCircleLine, RiExternalLinkLine } from "react-icons/ri";

function VideoPlayer(props) {
  const title    = props.title;
  const videoId  = props.videoId;
  const channel  = props.channel;
  const duration = props.duration;

  const thumbUrl  = "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg";
  const watchUrl  = "https://www.youtube.com/watch?v=" + videoId;

  function handleWatch() {
    window.open(watchUrl, "_blank");
  }

  return (
    <div className="card overflow-hidden group hover:border-brand-500/30 transition-all duration-200">
      <div className="relative">
        <img
          src={thumbUrl}
          alt={title}
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleWatch}
            className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center shadow-glow hover:scale-110 transition-transform"
          >
            <RiPlayCircleLine className="text-white text-3xl" />
          </button>
        </div>
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-lg">
            {duration}
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
          {title}
        </h4>
        {channel && (
          <p className="text-slate-400 text-xs mb-3">{channel}</p>
        )}
        <button
          onClick={handleWatch}
          className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors"
        >
          Watch on YouTube
          <RiExternalLinkLine className="text-xs" />
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;