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
        { id: 1, name: "Slappy the Frog", attendance: [] }, 
        { id: 2, name: "Lilly the Lizard", attendance: [] }, 
        { id: 3, name: "Paulrus the Walrus", attendance: [] }, 
        { id: 4, name: "Gregory the Goat", attendance: [] }, 
        { id: 5, name: "Adam the Anaconda", attendance: [] }
      ];
      const lessonsNumber = 12;

      return {
        getStudents: () => { 
          return localStorage.students ? JSON.parse(localStorage.students) : (helpers.fillLocalStorageWithStudents(students, lessonsNumber));
        },
        saveStudents: (students) => {
          localStorage.students = JSON.stringify(students);
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
        let attendanceCheckboxes = student.attendance.reduce( (total, nextItem, index) => {
          let value = nextItem ? "checked" : "";
          return total + `<td class="attend-col"><input type="checkbox" ${value}></td>`;
        }, "");
        let missedLessons = student.attendance.filter( (item) => { return !item } );
        return `<tr class="student" id="${student.id}">
                  <td class="name-col">${student.name}</td>
                  ${attendanceCheckboxes}
                  <td class="missed-col">${missedLessons.length}</td>
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
          let entireHtml = headerTemplate(students) + bodyTemplate(students);
          let table = document.getElementById("students-table");
          table.innerHTML = entireHtml;
          let checkboxes = table.getElementsByTagName("input");
          for(let checkbox of checkboxes){
            checkbox.addEventListener('click', controller.recalculateRow);
          }
        }
      };
    })();

    let controller = ( () => {
      let students = model.getStudents();

      return {
        init: () => {
          view.render(students);
        },
        recalculateRow: function () {
          let parentRow = $(this).parent().parent();
          let studentId = +parentRow.prop("id");
          let missedElem = parentRow.find("td.missed-col");
          let selectedRowCheckboxes = parentRow.find("td input");
          let missedValue = 0;
          selectedRowCheckboxes.each((index, elem) => {
            let checked = $(elem).prop('checked');
            if(!checked){
              missedValue++
            }
            let student = students.filter((st) => {return st.id === studentId;})[0];
            student.attendance[index] = checked;
          });
          missedElem.text(missedValue);
          model.saveStudents(students);
        }
      };
    })();

    controller.init();
  }());
