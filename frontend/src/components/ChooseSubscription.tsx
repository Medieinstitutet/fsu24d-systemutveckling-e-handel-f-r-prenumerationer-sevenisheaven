import { useSubscriptions } from "../hooks/useSubscriptions";

interface ChooseSubscriptionProps {
  subscription: string;
  setSubscription: React.Dispatch<React.SetStateAction<string>>;
  handleNext: () => void;
}

export const ChooseSubscription = ({
  subscription,
  setSubscription,
  handleNext,
}: ChooseSubscriptionProps) => {
  const { subscriptions } = useSubscriptions();

  return (
    <>
      <section className="subscriptions">
        {subscriptions.map((s) => (
          <button
          disabled={s._id === subscription}
          style={{ opacity: s._id === subscription ? 0.5 : 1 }}
          key={s._id}
          onClick={() => {
            setSubscription(s._id);
            handleNext();
          }}
          >
            <div className="subscription">
              <div className="level-div">
                <h4>{s.level_name}</h4>
                <img style={{ height: "80px" }} src={`${window.location.hostname === "medieinstitutet.github.io" ? '/fsu24d-systemutveckling-e-handel-f-r-prenumerationer-sevenisheaven' : ''}${s.imageUrl}`} />
                <p>
                  {s.description}
                </p>
              </div>
  
              <div className="price-div">
                <h1 style={{ fontSize: "2.5rem" }}>{s.price} €</h1>
              </div>
            </div>
          </button>
        ))}
      </section>
    </>
  )
};
