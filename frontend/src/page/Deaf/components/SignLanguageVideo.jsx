import React from "react";

export default function SignLanguageVideo() {
  return (
    <div className="w-full">
      <video controls className="w-full rounded-lg">
        <source src="/videos/sign-language-demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="text-gray-600 mt-2">
        This video demonstrates common sign language phrases.
      </p>
    </div>
  );
}