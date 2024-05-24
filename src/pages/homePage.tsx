import '@aws-amplify/ui-react/styles.css'
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
import MapWithItems from '../components/MapWithItems';

import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";


const client = generateClient<Schema>();

function homePage() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

    useEffect(() => {
      client.models.Todo.observeQuery().subscribe({
        next: (data) => setTodos([...data.items]),
      });
    }, []);
    
    function createTodo() {
      client.models.Todo.create({ content: window.prompt("Todo content") });
    }
    
    function deleteTodo(id: string) {
      client.models.Todo.delete({ id })
    }

    return (
        <main>         
        <h1>For sale:</h1>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{todo.content}</li>
          ))}
        </ul>
        <div>
        <MapWithItems />
        <button onClick={createTodo}>+ new</button>
        </div>
      </main>
    );
}


export default homePage;



