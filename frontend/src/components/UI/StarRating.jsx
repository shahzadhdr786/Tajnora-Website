import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ rating = 0, count, size = 14 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} size={size} color="#d4af37" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} size={size} color="#d4af37" />);
    else stars.push(<FaRegStar key={i} size={size} color="#d4af37" />);
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div className="stars">{stars}</div>
      {count !== undefined && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>({count})</span>}
    </div>
  );
}
