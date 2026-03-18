const posts = [
  {
    slug: "shooting-with-intent",
    title: "Shooting with Intent",
    date: "2026-03-18",
    location: "Dhikala, Jim Corbett National Park",
    excerpt:
      "On reading the light, finding your position, and letting the forest build the frame for you.",
    content: [
      {
        type: "text",
        body: "You don\u2019t simply visit Dhikala. Something shifts the moment you pass through the iconic Dhangarhi gate with its weathered map of the entire zone laid out before you. From there, the Sal canopies close in overhead, the high banks rise beside you, and the old rest houses appear one after another like chapters in a story you\u2019ve heard but never believed. If you\u2019ve read Jim Corbett, this is where his words come alive. The forests he wrote about so captivatingly aren\u2019t pages anymore. They\u2019re standing right in front of you. Goosebumps.",
      },
      {
        type: "image",
        image: {
          url: "https://res.cloudinary.com/duiyn8wll/image/upload/v1772733486/_Z9_20260212_083717_TMH_wm_rbn0iq.jpg",
          alt: "Morning light filtering through the Sal forest canopy in Dhikala",
        },
      },
      {
        type: "text",
        body: "The soft morning winter light cuts through ancient Sal canopies while rustling leaves, Himalayan woodpeckers, and the sudden alarm call of a barking deer break the silence. It sounds simple, but it stops you in your tracks. I think it\u2019s fair to also say you experience the wildlife there. Sambar deer crossing the rivers in no rush, tigers patrolling the banks of the Ramganga, and the helter skelter of a junglefowl as a jeep gets closer. Every encounter leaves you a little more still than the last.",
      },
      {
        type: "image",
        image: {
          url: "https://res.cloudinary.com/duiyn8wll/image/upload/v1772733496/_Z9_20260212_083923_TMH_wm_kcmr10.jpg",
          alt: "Tiger walking along the forest road in Jim Corbett National Park",
        },
      },
      {
        type: "text",
        body: "Every photographer carries a frame in their head that they haven\u2019t captured yet. For me, it was winding roads graced by the feline. On a recent trip, I was able to frame that dream. I positioned myself ahead of the jeep traffic, found a spot where the light broke through the canopy, and waited. Camera settings already dialed in. Nothing left to do but watch the road. Then the tiger stepped out. You only get a few seconds in moments like these. Your thumbs make micro adjustments on the dials while the rest of you stays still. The eye contact came first. Then the frame.",
      },
      {
        type: "quote",
        text: "Don\u2019t chase the frame. Read the light, find your position, get your settings right, and let the environment build it for you. The story worthy frame comes when you stop forcing it.",
      },
      {
        type: "image",
        image: {
          url: "https://res.cloudinary.com/duiyn8wll/image/upload/v1772375128/_Z9_20260210_141141_TMH_wm_ok5nkh.jpg",
          alt: "Bengal tiger on a winding forest road, dappled light breaking through the Sal canopy",
        },
      },
    ],
  },
];

export function getAllPosts() {
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) || null;
}

export function getPostOgImage(post) {
  if (post.heroImage) return post.heroImage.url;
  const imageBlock = post.content.find((b) => b.type === "image");
  return imageBlock ? imageBlock.image.url : null;
}
