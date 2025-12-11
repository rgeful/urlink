import React from 'react';
import Marquee from 'react-fast-marquee';

const MarqueeComponent = () => {
  const marqueeStrings = [
    'creators',
    'entrepreneurs',
    'freelancers',
    'influencers',
    'artists',
    'musicians',
    'bloggers',
    'actors',
    'athletes',
  ];

  const gradients = [
    "from-pink-300 to-blue-300",
    "from-orange-300 to-yellow-300",
    "from-blue-300 to-green-300",
    "from-purple-300 to-pink-300",
    "from-teal-300 to-lime-300",
    "from-blue-300 to-purple-300",
    "from-rose-300 to-amber-300",
    "from-emerald-300 to-sky-300",
    "from-indigo-300 to-fuchsia-300",
  ];

  return (
    <Marquee pauseOnHover gradient={false} speed={60} autoFill>
      {marqueeStrings.map((item, index) => (
        <span
          key={index}
            className={`
            inline-block shadow-sm
            text-xl px-8 py-4 rounded-full mr-6
            md:text-3xl md:px-20 md:py-10 md:mr-10
            font-semibold text-white
            bg-linear-to-r ${gradients[index % gradients.length]}
            `}
        >
          {item}
        </span>
      ))}
    </Marquee>
  );
};

export default MarqueeComponent;