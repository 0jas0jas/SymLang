import GestureRecognition from '@/components/GestureRecognition';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url('/bg.JPG')",
        }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <Image src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGJhcGZ6dTJlenpiZzFjemNodncyb2NxbXRrNzJlcjRkNWlxZTJsMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiIzJSKB4l7xTouE8/giphy.gif" alt="Gif Image" width={500} height={500} />
            <p className="mb-5 text-3xl font-extrabold">
              SymLang is a language made for everyone.
            </p>
            <Link href="/lang">
              <button className="btn btn-primary">Get straight to the app!</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-10 p-32">
        <h1 className="text-4xl font-bold">How to use SymLang</h1>
        <p className="text-xl">SymLang runs on your fingers. Literally. We have a limited set of statements you can perform with just your fingers.</p>
        <Image src='https://media1.tenor.com/m/dn9TsELSZyUAAAAd/the-power-of-the-sun-in-the-palm-of-my-hand-doctor-octopus.gif' width={400} height={400} alt={'SUN'} />
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Statement</th>
                <th>Symbol</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>IF..THEN..ENDIF</td>
                <td>L shape (or an opposite L)</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>LOOP</td>
                <td>Make an `O` with your hand</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>PRINT</td>
                <td>Devil's horns</td>
              </tr>
              {/* row 4 */}
              <tr>
                <th>4</th>
                <td>NUMS1-5</td>
                <td>Your fingers!</td>
              </tr>
              {/* row 5 */}
              <tr>
                <th>5</th>
                <td>NOT (or MINUS)</td>
                <td>A straight "wall" with your hand facing sideways</td>
              </tr>
              {/* row 6 */}
              <tr>
                <th>6</th>
                <td>LTHAN</td>
                <td>Try making a less-than symbol with your hand</td>
              </tr>
              <tr>
                <th>7</th>
                <td>GTHAN</td>
                <td>Try making a greater-than symbol with your hand</td>
              </tr>
              {/* row 7 */}
              <tr>
                <th>8</th>
                <td>PLUS</td>
                <td>Cross your fingers for good-luck</td>
              </tr>
              {/* row 8 */}
              <tr>
                <th>9</th>
                <td>EQUALS</td>
                <td>How would you signal perfect?</td>
              </tr>
              {/* row 9 */}
              <tr>
                <th>10</th>
                <td>XVAR</td>
                <td>Make a fist towards the camera</td>
              </tr>


            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}