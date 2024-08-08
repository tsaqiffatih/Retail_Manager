**userController.ts

=> login : 
    => semua user bisa mengakses method ini
=> registerUser :
    => user memerlukan authentication (di handle di middleware)
    => setiap role memiliki hak akses yang berbeda
=> editUser :
    => role "OWNER" hanya bisa editUser user yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa editUser user yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa editUser user miliknya sendiri
=> deleteUser :
    => role "SUPER ADMIN" hanya bisa menghapus "OWNER"
    => role "OWNER" hanya bisa menghapus selain "SUPER ADMIN"
    => role "OWNER" hanya bisa menghapus yang berada di store miliknya
    => role "ADMIN" & "MANAGER" hanya bisa menghapus user yang toko nya sama dengan dia
=> readOne :
    => role "OWNER" hanya bisa readOne user yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa readOne user yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa readOne user miliknya sendiri
=> readAll : 
    => role "OWNER" akan di berikan semua data user yang berada di store miliknya
    => role "ADMIN" & "MANAGER" akan di berikan semua data user yang berada di store tempat dia


**storeController.ts

note: "EMPLOYEE" & "SUPER ADMIN" tidak punya akses.

=> readAll :
    => role "OWNER" akan di berikan semua data store yang berada di store miliknya
    => role "ADMIN" & "MANAGER" akan di berikan semua data store yang berada di store tempat dia
=> createStore :
    => hanya role "OWNER" yang bisa
=> readOneStore :
    => role "OWNER" akan di berikan semua data store yang berada di store miliknya
    => role "ADMIN" & "MANAGER" akan di berikan semua data store yang berada di store tempat dia
=> destroyStore : 
    => hanya "OWNER" yang bisa 
=> editStore :
    => hanya "OWNER" yang bisa 


** employeeController.ts:

note: "SUPER ADMIN" tidak punya akses.
=> readOneEmployee :
    => role "OWNER" hanya bisa readOneEmployee yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa readOneEmployee yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa readOneEmployee miliknya sendiri
=> editEmployee :
    => role "OWNER" hanya bisa editEmployee yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa editEmployee yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa editEmployee miliknya sendiri


** payrollController.ts :

note: "SUPER ADMIN" tidak punya akses.
=> createPayroll : 
    => role "OWNER" hanya bisa createPayroll yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa createPayroll yang toko nya sama dengan dia
    => role "EMPLOYEE" gak bisa
=> readOnePayroll :
    => role "OWNER" hanya bisa readOnePayroll yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa readOnePayroll yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa readOnePayroll miliknya sendiri
=> editPayroll : 
    => role "OWNER" hanya bisa editPayroll yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa editPayroll yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa editPayroll miliknya sendiri
=> deletePayroll : 
    => role "OWNER" hanya bisa deletePayroll yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa deletePayroll yang toko nya sama dengan dia
    => role "EMPLOYEE" gak punya akses
=> readAllPayrolls : MASIH TAHAP PENGEMBANGAN
=> generatePayrollReport : MASIH TAHAP PENGEMBANGAN


** attendanceController.ts :

note: "SUPER ADMIN" tidak punya akses.
=> createAttendance :
    => role "OWNER" hanya bisa createAttendance yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa createAttendance yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa createAttendance miliknya sendiri
=> deleteAttendance :
    => role "OWNER" hanya bisa deleteAttendance yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa deleteAttendance yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa deleteAttendance miliknya sendiri
=> editAttendance :
    => role "OWNER" hanya bisa editAttendance yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa editAttendance yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa editAttendance miliknya sendiri
=> generateAttendanceReport :
    => role "OWNER" hanya bisa generateAttendanceReport yang berada di store mliknya
    => role "ADMIN" & "MANAGER" hanya bisa generateAttendanceReport yang toko nya sama dengan dia
    => role "EMPLOYEE" hanya bisa generateAttendanceReport miliknya sendiri
