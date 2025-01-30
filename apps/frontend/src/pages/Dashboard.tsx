import { useQuery } from "@tanstack/react-query"
import { fetchProfile } from "./Profile"

const Dashboard = () => {
  const {data} = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile
  })

  return (
    <section className="bg-[#242627] text-white rounded-lg p-4 h-full">
    <header className="p-4 flex flex-col justify-between text-2xl font-semibold">
        <h1>Dashboard</h1>
        <div className="flex flex-col pt-4">
            <h1 className="text-2xl font-semibold pb-2">Hi {data?.profile?.name}, let's chat!</h1>
            <p className="text-sm">Welcome back! Stay connected, stay updated.</p>
        </div>
    </header>
</section>
  )
}

export default Dashboard