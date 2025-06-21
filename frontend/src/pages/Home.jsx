import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Truck, 
  Package, 
  Users, 
  Shield, 
  Star, 
  Clock, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Truck className="h-12 w-12 text-primary-600" />,
      title: "For Drivers",
      description: "Create transport announcements, manage routes, and connect with cargo senders efficiently."
    },
    {
      icon: <Package className="h-12 w-12 text-secondary-600" />,
      title: "For Senders", 
      description: "Find reliable drivers, send transport requests, and track your cargo with real-time updates."
    },
    {
      icon: <Shield className="h-12 w-12 text-accent-600" />,
      title: "Secure & Verified",
      description: "Verified users, secure payments, and comprehensive insurance coverage for peace of mind."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50,000+", label: "Successful Deliveries" },
    { number: "4.8/5", label: "Average Rating" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Connect. Transport. 
              <span className="text-primary-200"> Deliver.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              The most trusted logistics platform connecting drivers and cargo senders 
              for efficient, secure, and reliable transportation.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="bg-white text-primary-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/announcements" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors"
                >
                  Browse Transports
                </Link>
              </div>
            ) : (
              <Link 
                to="/dashboard" 
                className="bg-white text-primary-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Every User
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're a driver looking for cargo or a sender needing transport, 
              we've got you covered with powerful tools and features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-200 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get your cargo moving
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Sign Up & Verify</h3>
              <p className="text-gray-600">
                Create your account and get verified to build trust in our community
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Post or Find</h3>
              <p className="text-gray-600">
                Drivers post announcements, senders browse and send requests
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Transport & Rate</h3>
              <p className="text-gray-600">
                Complete the transport safely and rate each other for future trust
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of drivers and senders who trust TransportConnect 
              for their logistics needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Sign Up as Driver
              </Link>
              <Link 
                to="/register" 
                className="bg-secondary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary-700 transition-colors"
              >
                Sign Up as Sender
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;