import { Route } from 'react-router-dom'
import { RequireSession } from './guards/RequireSession'
import { Home } from '../pages/home/index'
import { ChapterLibrary } from '../pages/chapter-library/index'
import { Practice } from '../pages/practice/index'
import { StudentLogin } from '../pages/student-login/index'
import { StudyPlanner } from '../pages/study-planner/index'
import { Dashboard } from '../pages/dashboard/index'
import { Tools } from '../pages/tools/index'
import { ChapterPreview } from '../pages/chapter-preview/index'
import { Mocks } from '../pages/mocks/index'
import { CreateMock } from '../pages/create-mock/index'
import { MockAttempt } from '../pages/mock-attempt/index'
import { Mistakes } from '../pages/mistakes/index'
import { Flashcards } from '../pages/flashcards/index'
import { ChapterReader } from '../pages/chapter-reader/index'
import { StudentProfile } from '../pages/student-profile/index'

export const studentRoutes = <>
  <Route path="/" element={<Home/>}/>
  <Route path="/course" element={<RequireSession><ChapterLibrary publicCatalog/></RequireSession>}/>
  <Route path="/course/:chapter" element={<RequireSession><ChapterPreview/></RequireSession>}/>
  <Route path="/tools" element={<RequireSession><Tools/></RequireSession>}/>
  <Route path="/tools/planner" element={<RequireSession><StudyPlanner/></RequireSession>}/>
  <Route path="/app" element={<RequireSession><Dashboard/></RequireSession>}/>
  <Route path="/app/chapters" element={<RequireSession><ChapterLibrary/></RequireSession>}/>
  <Route path="/app/chapters/:id" element={<RequireSession><ChapterReader/></RequireSession>}/>
  <Route path="/app/mocks" element={<RequireSession><Mocks/></RequireSession>}/>
  <Route path="/app/mocks/new" element={<RequireSession><CreateMock/></RequireSession>}/>
  <Route path="/app/attempts/:id" element={<RequireSession><MockAttempt/></RequireSession>}/>
  <Route path="/app/attempts/:id/review" element={<RequireSession><MockAttempt/></RequireSession>}/>
  <Route path="/app/results" element={<RequireSession><Mocks results/></RequireSession>}/>
  <Route path="/app/mistakes" element={<RequireSession><Mistakes/></RequireSession>}/>
  <Route path="/app/flashcards" element={<RequireSession><Flashcards/></RequireSession>}/>
  <Route path="/app/profile" element={<RequireSession><StudentProfile/></RequireSession>}/>
  <Route path="/tools/flashcards" element={<RequireSession><Flashcards/></RequireSession>}/>
  <Route path="/study/library" element={<RequireSession><ChapterLibrary/></RequireSession>}/>
  <Route path="/practice" element={<RequireSession><Practice/></RequireSession>}/>
  <Route path="/sign-in" element={<StudentLogin/>}/>
</>
