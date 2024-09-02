import React from 'react';
import './Projects.css'; // Import the CSS file
import data from '../database/projects.json';

const ProjectCard = ({ title, description, imagePath, onReadMoreClick }) => {
  return (
    <div className="project-card">
      <div className="project-image">
        <img src={require(`../database/${imagePath}`)} alt={title} />
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
      <button className="modBtn" onClick={() => onReadMoreClick(title)}>Read More <i className="fa fa-long-arrow-right"></i></button>
    </div>
  );
};

const ProjectModal = ({ isOpen, onClose, projectDetails }) => {
  if (!isOpen || !projectDetails) return null;

  // Use fullDescription if available, otherwise fallback to description
  const modalDescription = projectDetails.fullDescription || projectDetails.description;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={onClose}>&times;</span>
          <h1>{projectDetails.title}</h1>
          <p>{projectDetails.authors}</p>
        </div>
        <div className="modal-body">
          <div className="modal-img">
            <img src={require(`../database/${projectDetails.imagePath}`)} alt={projectDetails.title} className="img-responsive img-centered" />
          </div><br />
          <p>{modalDescription}</p>
          {/* Display links here */}
        </div>
      </div>
    </div>
  );
};




function App() {
  const projectsByYear = {};
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [currentProjectDetails, setCurrentProjectDetails] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState('23'); // Default to '2023'
  const YearTabs = ({ years, onSelectYear }) => {
    return (
      <div className="year-tabs">
        {years.map(year => (
          <button key={year} onClick={() => onSelectYear(year)}>
            Summers' {year}
          </button>
        ))}
      </div>
    );
  };
  const handleSelectYear = (year) => {
    setSelectedYear(year);
  };
  const handleReadMoreClick = (title) => {
    const project = data.Projects.find(p => p.title === title);
    setCurrentProjectDetails(project);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentProjectDetails(null);
  };
  // Group projects by year
  data.Projects.forEach((project) => {
    const year = project.year;
    if (!projectsByYear[year]) {
      projectsByYear[year] = [];
    }
    projectsByYear[year].push(project);
  });

  // Get the years in reverse chronological order
  const sortedYears = Object.keys(projectsByYear).sort((a, b) => b.localeCompare(a));

  return (
    <>
    <h1 class = "project-heading"> Projects </h1>
      <YearTabs years={sortedYears} onSelectYear={handleSelectYear} />
      <div className="project-container">
        {projectsByYear[selectedYear]?.map((project, index) => (
          <React.Fragment key={project.title}>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  imagePath={project.imagePath}
                  onReadMoreClick={handleReadMoreClick}
                />
                {((index + 1) % 3 === 0) && <div style={{flexBasis: '100%', height: '0'}}></div>}
                </React.Fragment>
        ))}
      </div>
      <ProjectModal isOpen={isModalOpen} onClose={handleCloseModal} projectDetails={currentProjectDetails} />
    </>
  );
}

export default App;
export { ProjectCard };
