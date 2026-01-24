'use client';
import PageHeader from '@/components/shared/pageHeader/PageHeader';

import LeaveRequestCard from '@/components/teams/leaves/LeaveRequestCard';
import LeaveHistoryCard from '@/components/teams/leaves/LeaveHistoryCard';

const UserLeavesPage = () => {
    return (
        <><PageHeader>
        </PageHeader>
            <div className="container-fluid mt-4">
                <div className="row g-4">
                    <div className="col-xl-4 col-lg-5 col-12">
                        <LeaveRequestCard />
                    </div>

                    <div className="col-xl-8 col-lg-7 col-12">
                        <LeaveHistoryCard />
                    </div>
                </div>

            </div>
        </>
    );
};

export default UserLeavesPage;
