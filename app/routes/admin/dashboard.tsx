import { Header } from "components";

const Dashboard = () => {
  const user = {
    name: "John",
  };
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user.name ?? "Guest"} 👋`}
        description="Track activity, trends and popular destination in real time."
      />

      <h1>Dashboard Page content</h1>
    </main>
  );
};

export default Dashboard;
