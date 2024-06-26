import { useContext, useState } from "react";
import { todoContext } from "./context";
import { InputRename } from "./(modal_estruture)/inputRename";
import { TextArea } from "./(modal_estruture)/textArea";
import { Description } from "./(modal_estruture)/Description";
import { DeleteButton } from "./(modal_estruture)/delete_button";
import { HeaderOfModal } from "./(modal_estruture)/header";
import { UpdateDB } from "./utility/updateDB";
import { ContainerOfFlags } from "./(modal_estruture)/flagContainer";
import { TutorialModal } from "./utility/tutorialModal";

export const Modal = () => {
  const {
    setSideBar,
    rename,
    setRename,
    setTask,
    sideBar,
    descrebe,
    setDescrebe,
    title,
    task,
    indexed
  } = useContext(todoContext);
  const content = `
    Ao clicar em alguma das opções, como "academia", você vai marca que esta tarefa
    é voltada para academia, assim, ajudando no reconhecendo no tipo de tarefa. Ao
    escolher uma das opções, a bolinha irá aparecer no canto superior direito da tarefa
    com sua respectiva cor, que ajuda na identificação do tipo da tarefa. Também é 
    possível alterar seu tipo quando quiser!
  `
  const [displayControl, setDisplayControl] = useState({
    visible: "hidden",
    blur: false,
  });
  // the function responsible of sideBar toggle
  const toggleSideBar = (): void => {
    setSideBar({
      ...sideBar,
      position: "right-[-200%]",
      display: "hidden",
    });
  };
  // The function responsible of adding a description of a task
  const addDescrebe = (): void => {
    const openDatabase: IDBOpenDBRequest = indexedDB.open("database");

    openDatabase.onsuccess = () => {
      const request:IDBDatabase = openDatabase.result;
      const transaction:IDBTransaction = request.transaction("tasks", 'readwrite');
      const store:IDBObjectStore = transaction.objectStore("tasks");
      const element:IDBRequest = store.get(title);

      element.onerror = () => {
        console.log("erro ao buscar o elemento!");
      }
      element.onsuccess = (event) => {
        console.log("elemento obtido com sucesso!");
        const currentTarget = (event.target as IDBRequest).result;
        currentTarget.description = descrebe; 

        store.put(currentTarget).onsuccess = () => { 
          UpdateDB(setTask, undefined, setDescrebe);
        }
      }

    }
  };
  // The function responsible about the rename setting
  const addRename = (): void => {
    const openDatabase: IDBOpenDBRequest = indexedDB.open("database");

    openDatabase.onsuccess = () => {
      const request:IDBDatabase = openDatabase.result;
      const transaction:IDBTransaction = request.transaction("tasks", 'readwrite');
      const store:IDBObjectStore = transaction.objectStore("tasks");
      const element:IDBRequest = store.get(title);

      element.onsuccess = (event) => {
        const elementTarget = (event.target as IDBRequest).result;
        elementTarget.title = rename;

        store.put(elementTarget).onsuccess = () => {
          console.log("rename is finished!")
          setRename("");
        }
      }

      UpdateDB(setTask, undefined, undefined);
    }
  };
  // The function responsible for delete a individual task
  const RemoveTask = () => {
    const openDatabase: IDBOpenDBRequest = indexedDB.open("database");

    openDatabase.onsuccess = () => {
      const request:IDBDatabase = openDatabase.result;
      const transaction:IDBTransaction = request.transaction("tasks", 'readwrite');
      const store:IDBObjectStore = transaction.objectStore("tasks");
      const element:IDBRequest = store.delete(title);

      element.onsuccess = () => {
        console.log("elemento removido com sucesso!");
        setDisplayControl({
          ...displayControl,
          visible: "hidden",
          blur: false,
        })
        toggleSideBar()
        UpdateDB(setTask);
      }
    }

  };
  // key events
  const addDescribeWithKey = (e: { key: string }) => {
    if (e.key === "Enter") {
      addDescrebe();
    }
  };
  const addRemameWithKey = (e: { key: string }) => {
    if (e.key === "Enter") {
      addRename();
    }
  };
  return (
    <>
      <div className={`fixed top-0 flex left-0 w-screen h-screen ${displayControl.blur ? "blur-sm" : " blur-0"} transition-all ${sideBar.display} z-30`}>
        <nav
          className={`
          absolute
          gap-5 
          flex
          flex-col 
          items-center 
          py-3 
          top-0 
          ${sideBar.position} 
          w-full 
          h-full  
          overflow-y-scroll 
          bg-white 
          text-black 
          dark:bg-[#121013] 
          px-3
          dark:text-white 
          `
        }
        >
          <HeaderOfModal closeModal={toggleSideBar} />
          {/* Input Rename */}
          <InputRename addRename={addRename} renameKey={addRemameWithKey} />
          {/* Textarea */}
          <TextArea
            addDescrebe={addDescrebe}
            addDescrebeWithKey={addDescribeWithKey}
            descrebe={descrebe}
            setDescrebe={setDescrebe}
          />
          {/* Description */}
          <Description indexed={indexed} task={task} />
          {/* flags */}
          <ContainerOfFlags/>        
          {/* Delet button */}
          <DeleteButton removeTask={RemoveTask}/>
          {/* ModalTutorial */}
          <TutorialModal content={content} />
        </nav>
      </div>
    </>
  );
};
