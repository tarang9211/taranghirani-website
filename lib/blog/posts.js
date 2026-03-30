const posts = [
  {
    slug: "understanding-behavior",
    title: "Understanding Behavior",
    date: "2026-03-26",
    excerpt:
      "On sonder, survival, and what keeps drawing us back to the wild places of the world.",
    content: [
      {
        type: "text",
        body: "What is it that draws us back to the jungles and forests across the world? This is a question that has been ringing for a while, and the echoes of it have only gotten louder each time. Disclaimer \u2014 there\u2019s no correct answer, but every answer is also correct.",
      },
      {
        type: "text",
        body: "On a recent safari, while we waited for action to happen, I came across a word that has been part of my vocabulary for years \u2014 sonder.",
      },
      {
        type: "quote",
        text: "Sonder. The realisation that every living creature around you is living a life just as layered as yours. Full of urgency. Full of intention. A life that carries on whether you\u2019re watching or not.",
      },
      {
        type: "text",
        body: "I\u2019ve wondered what brings me back \u2014 the sights, the sounds, the air, the peace, the passion to be closer to nature, the conversations with fellow wildlife lovers. Or is it just to observe another creation go about their life?",
      },
      {
        type: "text",
        body: "That\u2019s why we go. To spend time in their world, to experience wildlife while they go on about their lives. And their lives are all about survival \u2014 making sure their lineage continues. They are driven by emotion. And that, as a photographer, is what becomes key. Understanding behaviour. Reading that emotion or that moment.",
      },
      {
        type: "text",
        body: "An image that tells a story \u2014 whatever it may be. A kill. A mating ritual. A bird about to take off. A familial bond. Young ones learning how to survive.",
      },
      {
        type: "text",
        body: "Here are a few experiences that come to mind:",
      },
      {
        type: "text",
        body: "On a February morning in Dhikala, the forest gave us exactly that. We\u2019d been tracking Paarwali\u2019s daughter through a chain of langur alarm calls and conversations with other drivers. But it seemed like luck wasn\u2019t on our side \u2014 she had crossed the Ramganga and vanished into the grasslands on the far bank. Most would have moved on. We waited. And then our guide, Ravi bhai, with the composure and quiet certainty that comes from years of oneness with the jungle, said \u2014 \u0022\u091F\u093E\u0907\u0917\u0930 \u0906\u092F\u093E \u0939\u0948\u0902, \u0930\u0947\u0921\u0940 \u0930\u0939\u0928\u093E\u0022 (The tiger is here, stay ready). And as fate would have it, she reappeared from the far side of the grasslands, crossed the river again, and stepped onto our road. But she wasn\u2019t just passing through. She was on a mission \u2014 marking her territory, exhibiting the Flehmen response, completely absorbed in her own world. For over five minutes, we watched her work the road, sniffing, claiming, asserting. And then, just as quietly as she\u2019d arrived, she disappeared into the bushes.",
      },
      {
        type: "image",
        image: {
          url: "https://res.cloudinary.com/duiyn8wll/image/upload/v1774508046/_Z9_20260212_100758_TMH_website_s3qioq.jpg",
          alt: "Paarwali's daughter patrolling her territory in Dhikala",
        },
      },
    ],
  },
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
          alt: "Winter light filtering through the Sal forest canopy in Dhikala",
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
          alt: "Saal canopy along the Dhikala main road",
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
          alt: "Tiger on a forest road in Dhikala",
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
