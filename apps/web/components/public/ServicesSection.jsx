import * as Icons from "react-icons/fa";
import { getSection, getServices } from "@/lib/api-server";
import { sanitize } from "@/lib/sanitize";
import "./ServicesSection.css";

export default async function ServicesSection() {
  const [home, services] = await Promise.all([
    getSection("home").catch(() => ({})),
    getServices().catch(() => []),
  ]);

  const title = home?.services_title?.value ?? "Nos Services";

  return (
    <section className="services-section">
      <h2 className="services-title" dangerouslySetInnerHTML={{ __html: sanitize(title) }} />

      <div className="services-cards">
        {services.map((service) => {
          const IconComponent = Icons[service.icon] || Icons.FaBuilding;
          return (
            <div className="service-card" key={service.id}>
              <div className="service-icon">
                <IconComponent />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
