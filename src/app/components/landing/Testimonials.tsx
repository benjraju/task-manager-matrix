import { marketingContent } from '@/lib/content/marketingContent';

export default function Testimonials() {
  const { testimonials, stats } = marketingContent;

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by thousands of professionals
            </h2>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-16 space-y-8 lg:mt-20 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.author} className="rounded-2xl bg-gray-50 p-8">
                <blockquote className="text-gray-900">
                  <p className="text-lg font-semibold leading-8">"{testimonial.quote}"</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 