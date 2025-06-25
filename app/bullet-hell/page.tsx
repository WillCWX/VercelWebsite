export default function BulletHellPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <script src="/coi-serviceworker.js" async />
      <iframe
        title="Bullet Hell"
        src="/games/bullet-hell/Bullet Hell.html"
        width={600}
        height={600}
      />
    </div>
  );
}
