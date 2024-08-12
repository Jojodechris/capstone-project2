import React from "react";

function Message() {



  // Array of proverbs about books
  const bookProverbs = [
    {
      proverb: "The man who does not read good books has no advantage over the man who can't read them.",
      author: "Mark Twain",
      authorImage: "https://hips.hearstapps.com/hmg-prod/images/gettyimages-517320104.jpg?crop=0.558xw:0.991xh;0.145xw,0.00920xh&resize=640:*",
    },
    {
      proverb: "Reading is a discount ticket to everywhere.",
      author: "Mary Schmich",
      authorImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxRbl3gFwBVIGKT3IM1rYgi1ovHcancJ7ha47X3uLgPz3RIJQL4l2I8Piqm7eRplUmCgU&usqp=CAU",
    },
    {
      proverb: "Books are a uniquely portable magic.",
      author: "Stephen King",
      authorImage: "https://cdn.britannica.com/20/217720-050-857D712B/American-novelist-Stephen-King-2004.jpg",
    },
    {
      proverb: "Books are the mirrors of the soul.",
      author: "Virginia Woolf",
      authorImage: "https://cdn.britannica.com/82/138382-050-2E8FCB26/Virginia-Woolf.jpg",
    },
    {
      proverb: "There is no friend as loyal as a book.",
      author: "Ernest Hemingway",
      authorImage: "https://www.conchtourtrain.com/wp-content/uploads/2023/04/ernest-hemingway-writing.jpg",
    },
    {
      proverb: "A book is like a garden carried in the pocket.",
      author: "Chinese Proverb",
      authorImage: "image_address_of_chinese_proverb.jpg",
    },
    {
      proverb: "Books are the plane, and the train, and the road. They are the destination, and the journey. They are home.",
      author: "Anna Quindlen",
      authorImage: "https://annaquindlen.com/wp-content/uploads/2021/04/DSC6411-1024x1280-1-e1619452353475.jpg",
    },
    {
      proverb: "The world is a book, and those who do not travel read only one page.",
      author: "Saint Augustine",
      authorImage: "https://res.cloudinary.com/diyyvqvpa/image/upload/f_auto,q_auto/v1/saint-coleman-website/augustine",
    },
    {
      proverb: "To read without reflecting is like eating without digesting.",
      author: "Edmund Burke",
      authorImage: "image_address_of_burke.jpg",
    },
    {
      proverb: "In the case of good books, the point is not how many of them you can get through, but rather how many can get through to you.",
      author: "Mortimer J. Adler",
      authorImage: "image_address_of_adler.jpg",
    },
    // Add more proverbs with authors and their images
  ];
  

  // Function to get a random proverb
  const getRandomProverb = () => {
    const randomIndex = Math.floor(Math.random() * bookProverbs.length);
    return bookProverbs[randomIndex];
  };

  // If there are no books available, display a random proverb
//   if (!books || books.length === 0) {
    const randomProverb = getRandomProverb();
    return (
      <div className="random">
        <h2><i>{randomProverb.proverb}</i></h2> 
        <p>{randomProverb.author}</p>
        {/* <img src={randomProverb.authorImage} alt={`${randomProverb.author}'s image`} /> */}
        {/* Additional content for the welcome page */}
      </div>
    );
  }

  // If there are books available, return null (no message will be displayed)
//   return null;
// }

export default Message;