  /* STUDENT APPLICATION */
  (function() {

    let helpers = ( () => {     
      return {
        getRandom: () => {
          return (Math.random() >= 0.5);
        },
        fillLocalStorageWithStudents: (students, lessonsNumber) => {
          for(let student of students){
            for (let i = 0; i < lessonsNumber; i++){
              student.attendance.push(helpers.getRandom());
            }
          }
          localStorage.students = JSON.stringify(students);
          return students;
        }
      }
    })();

    let model = ( () => {
      let students = [
        { name: "Slappy the Frog", attendance: [] }, 
        { name: "Lilly the Lizard", attendance: [] }, 
        { name: "Paulrus the Walrus", attendance: [] }, 
        { name: "Gregory the Goat", attendance: [] }, 
        { name: "Adam the Anaconda", attendance: [] }
      ];
      const lessonsNumber = 12;

      return {
        getStudents: () => { 
          return localStorage.students ? JSON.parse(localStorage.students) : (helpers.fillLocalStorageWithStudents(students, lessonsNumber));
        }
      };
    })();

    let view = ( () => {
      let headerTemplate = (students) => {
        let lessonNumbers = students[0].attendance.reduce( (total, nextItem, index) => {
          return total + `<th>${index + 1}</th>`;
        }, "");
        return `<thead>
                  <tr>
                    <th class="name-col">Student Name</th>
                    ${lessonNumbers}
                    <th class="missed-col">Days Missed-col</th>
                  </tr>
                </thead>`;
      };
      let rowTemplate = (student) => {
        let attendanceCheckboxes = student.attendance.reduce( (total, nextItem) => {
          let value = nextItem ? "checked" : "";
          return total + `<td class="attend-col"><input type="checkbox" ${value}></td>`;
        }, "");
        return `<tr class="student">
                  <td class="name-col">${student.name}</td>
                  ${attendanceCheckboxes}
                </tr>`;
      };
      let bodyTemplate = (students) => {
        let studentRows = students.map( (student) => { return rowTemplate(student); } );
        return `<tbody>
                  ${studentRows.join("")}
                </tbody>`;
      };

      return {
        render: (students) => {
          let entireHtml = `<table id="students-table">
                              ${headerTemplate(students)}
                              ${bodyTemplate(students)}
                            </table>`;
          let tableContainer = document.getElementById("table-container");
          tableContainer.innerHtml = entireHtml;
        }
      };
    })();

    let controller = ( () => {

      return {
        init: () => {
          let students = model.getStudents();
          view.render(students);
        }
      };
    })();

    controller.init();
  }());
