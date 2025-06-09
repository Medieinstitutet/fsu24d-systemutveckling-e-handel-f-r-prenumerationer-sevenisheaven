import SockEmergency from "../assets/sock_emergency.png";
import SockRoll from "../assets/sock&roll.png";
import SockRoyalty from "../assets/sock_royalty.png";

interface ChooseSubscriptionProps {
  setSubscription: React.Dispatch<React.SetStateAction<string>>;
  handleNext: () => void;
}
export const ChooseSubscription = ({
  setSubscription,
  handleNext,
}: ChooseSubscriptionProps) => {
  return (
    <>
      <section className="subscriptions">
        <button
          onClick={() => {
            setSubscription("68380950c659b1a48ce18927");
            handleNext();
          }}
        >
          <div className="subscription">
            <div className="level-div">
              <h4>Sock Emergency</h4>
              <img style={{ height: "80px" }} src={SockEmergency} />
              <p>
                Start fresh with stylish essentials. Great quality, comfy fit,
                and timeless designs delivered monthly
              </p>
            </div>

            <div className="price-div">
              <h1 style={{ fontSize: "2.5rem" }}>14.99 €</h1>
            </div>
          </div>
        </button>
        <button
          onClick={() => {
            setSubscription("68380992c659b1a48ce18928");
            handleNext();
          }}
        >
          <div className="subscription">
            <div className="level-div">
              <h4>Sock & Roll</h4>
              <img style={{ height: "80px" }} src={SockRoll} />
              <p>
                Step it up with bolder patterns, richer materials, and
                limited-edition drops. Where comfort meets personality.
              </p>
            </div>
            <div className="price-div">
              <h1 style={{ fontSize: "2.5rem" }}>16.99 €</h1>
            </div>
          </div>
        </button>
        <button
          onClick={() => {
            setSubscription("683809b3c659b1a48ce18929");
            handleNext();
          }}
        >
          <div className="subscription">
            <div className="level-div">
              <h4>Sock Royalty</h4>
              <img style={{ height: "80px" }} src={SockRoyalty} />
              <p>
                Top-tier toes only. Exclusive designer styles, luxury fabrics,
                and maximum sock swag. The best of the best.
              </p>
            </div>{" "}
            <div className="price-div">
              <h1 style={{ fontSize: "2.5rem" }}>18.99 €</h1>
            </div>
          </div>
        </button>
      </section>
    </>
  );
};
