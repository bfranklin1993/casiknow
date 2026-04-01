interface StarRatingProps {
  rating: 1 | 2 | 3 | 4 | 5;
}

export default function StarRating({ rating }: StarRatingProps) {
  return (
    <span className="text-ck-accent text-sm tracking-wider">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "" : "opacity-30"}>
          {i <= rating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
